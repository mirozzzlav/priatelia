import {
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import filterIcon from "assets/filter.svg";
import matchIcon from "assets/match.svg";
import {
  ExpandableInfoBar,
  type ExpandableInfoBarItem,
} from "src/components/ExpandableInfoBar";
import {
  FormActions,
  FormInput,
  FormSubmitButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import { FormStatusMessage } from "src/components/FormStatusMessage";
import { CenteredStatusLayout } from "src/components/layouts";
import { LocationSearchField } from "src/components/LocationSearchField";
import { LoadingPill } from "src/components/LoadingPill";
import { PanelHeading } from "src/components/PanelHeading";
import { PhotoViewer } from "src/components/PhotoViewer";
import { ScrollCue } from "src/components/ScrollCue";
import { SvgImage } from "src/components/SvgImage";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { InfoScreen } from "src/features/info";
import {
  type ActivePersonPreviewAction,
  PersonPreviewDetail,
  PersonPreviewPhoto,
  type PersonPreview,
} from "src/features/person-preview";
import {
  apiClient,
  type ChatMatch,
  type DiscoverySettingsFieldErrors,
} from "src/services/api";

type DiscoveryRouteProps = {
  activeAction: ActivePersonPreviewAction;
  error: string | null;
  isLoadingPersonPreview: boolean;
  isSubmittingPersonPreviewAction: boolean;
  initialDiscoverySettings: DiscoverySettingsData;
  onActionEnd: () => void;
  onActionStart: (
    action: ActivePersonPreviewAction,
    onAfterSuccessfulAction?: () => Promise<void>,
  ) => void;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
  onPersonPreviewLoad: () => Promise<void>;
  personPreview: PersonPreview | null;
};

const styles = {
  deck: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "22px",
  },
  stickyHeader: {
    position: "sticky",
    top: "64px",
    zIndex: 20,
  },
  infoIcon: {
    filter: "grayscale(1) contrast(1.35)",
  },
  infoContent: {
    align: "stretch",
    spacing: "18px",
  },
  infoBody: {
    color: "app.text",
    fontSize: "md",
    lineHeight: 1.55,
  },
  connectionSummary: {
    alignItems: "baseline",
    display: "inline-flex",
    gap: "4px",
    maxW: "100%",
    minW: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  connectionCount: {
    color: "app.info",
    fontSize: "lg",
    fontWeight: "black",
    lineHeight: 1,
  },
  connectionLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  matchIconWrap: {
    position: "relative",
    align: "center",
    justify: "center",
    boxSize: "31px",
  },
  matchIconImage: {
    filter: "grayscale(1) contrast(1.35)",
  },
  matchIconCount: {
    position: "absolute",
    top: "48%",
    left: "50%",
    color: "app.white",
    fontSize: "9px",
    fontWeight: "black",
    lineHeight: 1,
    transform: "translate(-50%, -50%)",
  },
  filterForm: {
    display: "grid",
    gap: "16px",
  },
  filterAgeGrid: {
    columns: 2,
    gap: "10px",
  },
  matchList: {
    display: "grid",
    gap: "10px",
  },
  matchItem: {
    alignItems: "center",
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    minH: "76px",
    px: "14px",
    py: "12px",
    border: "1px solid",
    borderColor: "rgba(38, 57, 111, 0.14)",
    borderRadius: "12px",
    bg: "app.white",
  },
  matchText: {
    minW: 0,
  },
  matchName: {
    color: "app.text",
    fontSize: "md",
    fontWeight: "extrabold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  matchMeta: {
    color: "app.text",
    fontSize: "sm",
    fontWeight: "medium",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  matchPhoto: {
    boxSize: "52px",
    flexShrink: 0,
    borderRadius: "12px",
    objectFit: "cover",
  },
} as const;

function formatFilterSummary(settings: DiscoverySettingsData) {
  return `${settings.location}, ${settings.ageFrom}-${settings.ageTo} rokov, ${settings.radiusKm} km`;
}

function getNewConnectionLabel(count: number) {
  if (count === 1) {
    return "nové prepojenie";
  }

  if (count >= 2 && count <= 4) {
    return "nové prepojenia";
  }

  return "nových prepojení";
}

function NewConnectionSummary({ count }: { count: number }) {
  return (
    <Box as="span" {...styles.connectionSummary}>
      <Text as="span">Máš</Text>
      <Text as="span" {...styles.connectionCount}>
        {count}
      </Text>
      <Text as="span" {...styles.connectionLabel}>
        {getNewConnectionLabel(count)}.
      </Text>
    </Box>
  );
}

function MatchIconWithCount({ count }: { count: number }) {
  return (
    <Flex {...styles.matchIconWrap}>
      <SvgImage src={matchIcon} boxSize="31px" {...styles.matchIconImage} />
      <Text as="span" {...styles.matchIconCount}>
        {count > 99 ? "99+" : count}
      </Text>
    </Flex>
  );
}

type MatchInfoPanelProps = {
  isLoading: boolean;
  matches: ChatMatch[];
};

function MatchInfoPanel({ isLoading, matches }: MatchInfoPanelProps) {
  if (isLoading) {
    return <Text {...styles.infoBody}>Načítavam nové prepojenia.</Text>;
  }

  if (matches.length === 0) {
    return (
      <Text {...styles.infoBody}>Zatiaľ nemáš žiadne nové prepojenia.</Text>
    );
  }

  return (
    <VStack {...styles.infoContent}>
      <PanelHeading>Nové prepojenia</PanelHeading>
      <Box {...styles.matchList}>
        {matches.map((match) => (
          <Box key={match.id} {...styles.matchItem}>
            <Box {...styles.matchText}>
              <Text {...styles.matchName}>{match.name}</Text>
              <Text {...styles.matchMeta}>
                {match.age}, {match.location}
              </Text>
            </Box>
            <Image src={match.photo} alt={match.name} {...styles.matchPhoto} />
          </Box>
        ))}
      </Box>
    </VStack>
  );
}

type DiscoveryFilterPanelProps = {
  initialSettings: DiscoverySettingsData;
  onDiscoveryReload: () => Promise<void>;
  onSave: (data: DiscoverySettingsData) => void;
};

function DiscoveryFilterPanel({
  initialSettings,
  onDiscoveryReload,
  onSave,
}: DiscoveryFilterPanelProps) {
  const [formData, setFormData] =
    useState<DiscoverySettingsData>(initialSettings);
  const [fieldErrors, setFieldErrors] = useState<DiscoverySettingsFieldErrors>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const updateField =
    (field: keyof DiscoverySettingsData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldErrors({});
      setSubmitError(null);
      setWasSubmitted(false);
      setIsSuccess(false);
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleLocationChange = (nextLocation: {
    latitude: number | null;
    location: string;
    longitude: number | null;
  }) => {
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(false);
    setIsSuccess(false);
    setFormData((current) => ({
      ...current,
      location: nextLocation.location,
      locationLatitude: nextLocation.latitude,
      locationLongitude: nextLocation.longitude,
    }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setSubmitError(null);
    setWasSubmitted(true);
    setIsSuccess(false);

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.updateDiscoverySettings(formData);

      if (response.status === "error") {
        setFieldErrors(response.data.errors);
        setSubmitError("Skontroluj si vstupné údaje.");
        return;
      }

      onSave(formData);
      await onDiscoveryReload();
      setWasSubmitted(false);
      setIsSuccess(true);
    } catch {
      setSubmitError("Kritériá sa nepodarilo uložiť. Skús to znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" noValidate onSubmit={handleSubmit} {...styles.filterForm}>
      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.location)}>
        <LocationSearchField
          error={fieldErrors.location}
          isInvalid={wasSubmitted && Boolean(fieldErrors.location)}
          label="Hľadať v lokalite"
          onChange={handleLocationChange}
          value={formData.location}
          placeholder="napr. Bratislava a okolie"
        />
      </FormControl>

      <SimpleGrid {...styles.filterAgeGrid}>
        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.ageFrom)}>
          <RequiredFieldLabel>Vek od</RequiredFieldLabel>
          <FormInput
            type="number"
            min={18}
            value={formData.ageFrom}
            onChange={updateField("ageFrom")}
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.ageFrom}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.ageTo)}>
          <RequiredFieldLabel>Vek do</RequiredFieldLabel>
          <FormInput
            type="number"
            min={18}
            value={formData.ageTo}
            onChange={updateField("ageTo")}
          />
          <FormErrorMessage color="app.error">
            {fieldErrors.ageTo}
          </FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <FormControl isInvalid={wasSubmitted && Boolean(fieldErrors.radiusKm)}>
        <RequiredFieldLabel>Radius</RequiredFieldLabel>
        <FormInput
          type="number"
          min={1}
          max={500}
          value={formData.radiusKm}
          onChange={updateField("radiusKm")}
        />
        <FormErrorMessage color="app.error">
          {fieldErrors.radiusKm}
        </FormErrorMessage>
      </FormControl>

      {submitError && (
        <FormStatusMessage variant="error">{submitError}</FormStatusMessage>
      )}

      {isSuccess && (
        <FormStatusMessage variant="success">
          Kritériá sú uložené.
        </FormStatusMessage>
      )}

      <FormActions>
        <FormSubmitButton
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Ukladám kritériá"
        >
          Uložiť kritériá
        </FormSubmitButton>
      </FormActions>
    </Box>
  );
}

type DiscoveryInfoBarProps = {
  initialDiscoverySettings: DiscoverySettingsData;
  isLoadingMatches: boolean;
  matches: ChatMatch[];
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
};

function DiscoveryInfoBar({
  initialDiscoverySettings,
  isLoadingMatches,
  matches,
  onDiscoveryReload,
  onDiscoverySettingsSave,
}: DiscoveryInfoBarProps) {
  const newMatches = matches.filter((match) => !match.lastMessage);
  const discoveryInfoBarItems: ExpandableInfoBarItem[] = [
    {
      collapsedContent: formatFilterSummary(initialDiscoverySettings),
      expandedContent: (
        <DiscoveryFilterPanel
          key={formatFilterSummary(initialDiscoverySettings)}
          initialSettings={initialDiscoverySettings}
          onDiscoveryReload={onDiscoveryReload}
          onSave={onDiscoverySettingsSave}
        />
      ),
      icon: <SvgImage src={filterIcon} boxSize="21px" {...styles.infoIcon} />,
      id: "filter",
      label: "Filter",
    },
    {
      collapsedContent: isLoadingMatches
        ? "Načítavam nové prepojenia"
        : <NewConnectionSummary count={newMatches.length} />,
      expandedContent: (
        <MatchInfoPanel isLoading={isLoadingMatches} matches={newMatches} />
      ),
      icon: <MatchIconWithCount count={newMatches.length} />,
      id: "matches",
      label: "Prepojenia",
    },
  ];

  return (
    <ExpandableInfoBar defaultItemId="filter" items={discoveryInfoBarItems} />
  );
}

export function DiscoveryRoute({
  activeAction,
  error,
  isLoadingPersonPreview,
  isSubmittingPersonPreviewAction,
  initialDiscoverySettings,
  onActionEnd,
  onActionStart,
  onDiscoveryReload,
  onDiscoverySettingsSave,
  onPersonPreviewLoad,
  personPreview,
}: DiscoveryRouteProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [matches, setMatches] = useState<ChatMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const previewPhotos = useMemo(() => {
    if (!personPreview) {
      return [];
    }

    const photoUrls = Array.from(
      new Set([personPreview.photo, ...personPreview.photos]),
    );

    return photoUrls.map((src, index) => ({
      alt: `${personPreview.name}, fotka ${index + 1}`,
      src,
    }));
  }, [personPreview]);
  const openPreviewPhoto = (photoSrc: string) => {
    const photoIndex = previewPhotos.findIndex((photo) => photo.src === photoSrc);
    setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
  };
  const loadMatches = useCallback(async () => {
    try {
      const nextMatches = await apiClient.getChatMatches();
      setMatches(nextMatches);
    } catch {
      setMatches([]);
    }
  }, []);
  const handleActionStart = (action: ActivePersonPreviewAction) => {
    onActionStart(action, loadMatches);
  };

  useEffect(() => {
    if (personPreview || isLoadingPersonPreview || error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void onPersonPreviewLoad();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [error, isLoadingPersonPreview, onPersonPreviewLoad, personPreview]);

  useEffect(() => {
    let isMounted = true;

    apiClient
      .getChatMatches()
      .then((nextMatches) => {
        if (isMounted) {
          setMatches(nextMatches);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMatches([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingMatches(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadMatches();
    }, 20_000);

    return () => window.clearInterval(intervalId);
  }, [loadMatches]);

  if (isLoadingPersonPreview && !personPreview) {
    return (
      <Box {...styles.deck}>
        <CenteredStatusLayout minH="calc(100vh - 108px)" px="16px" py={0}>
          <LoadingPill text="Hľadám ti ďalšieho priateľa." />
        </CenteredStatusLayout>
      </Box>
    );
  }

  if (error) {
    return (
      <Box {...styles.deck}>
        <InfoScreen
          message="V tejto chvíli sa nám nepodarilo nájsť žiadneho nového priateľa, skús upraviť podmienky hľadania."
          title="Žiadny nový priateľ"
          variant="info"
        />
      </Box>
    );
  }

  return (
    <Box {...styles.deck}>
      {personPreview && (
        <>
          <Box {...styles.stickyHeader}>
            <DiscoveryInfoBar
              initialDiscoverySettings={initialDiscoverySettings}
              isLoadingMatches={isLoadingMatches}
              matches={matches}
              onDiscoveryReload={onDiscoveryReload}
              onDiscoverySettingsSave={onDiscoverySettingsSave}
            />
          </Box>
          <PersonPreviewPhoto
            activeAction={activeAction}
            isLoadingNextPerson={isSubmittingPersonPreviewAction}
            isSubmitting={isSubmittingPersonPreviewAction}
            onActionEnd={onActionEnd}
            onActionStart={handleActionStart}
            onPhotoClick={() => setSelectedPhotoIndex(0)}
            person={personPreview}
          />
          <ScrollCue />
          <PersonPreviewDetail
            onPhotoClick={openPreviewPhoto}
            person={personPreview}
          />
          <PhotoViewer
            initialIndex={selectedPhotoIndex}
            isOpen={selectedPhotoIndex !== null}
            onClose={() => setSelectedPhotoIndex(null)}
            onIndexChange={setSelectedPhotoIndex}
            photos={previewPhotos}
          />
        </>
      )}
    </Box>
  );
}
