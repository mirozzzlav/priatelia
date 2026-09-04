import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import filterIcon from "assets/filter.svg";
import matchIcon from "assets/match.svg";
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
import { ChatMatchList } from "src/features/messages";
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
  headerRoot: (
    isExpanded: boolean,
    expandedTop: number | null,
    topOffset: number,
  ) =>
    ({
      position: isExpanded ? "fixed" : "relative",
      top: isExpanded ? `${expandedTop ?? topOffset}px` : undefined,
      left: isExpanded ? "50%" : undefined,
      zIndex: isExpanded ? 30 : 1,
      w: isExpanded
        ? "min(100%, 460px)"
        : { base: "calc(100% + 24px)", sm: "calc(100% + 32px)" },
      h: isExpanded ? `calc(100dvh - ${expandedTop ?? topOffset}px)` : "56px",
      mx: isExpanded ? undefined : { base: "-12px", sm: "-16px" },
      bg: "app.white",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "rgba(38, 57, 111, 0.14)",
      boxShadow: isExpanded
        ? "0 18px 42px rgba(38, 57, 111, 0.18)"
        : "0 18px 42px rgba(38, 57, 111, 0.12)",
      color: "app.text",
      overflow: "hidden",
      transform: isExpanded ? "translateX(-50%)" : undefined,
      transition:
        "height 220ms ease, box-shadow 220ms ease, background 220ms ease",
    }) as const,
  headerRow: {
    align: "center",
    justify: "space-between",
    w: "100%",
    h: "56px",
    px: "12px",
    pt: "5px",
    pb: "9px",
    gap: "10px",
  },
  filterToggle: {
    align: "center",
    display: "flex",
    flex: 1,
    gap: "9px",
    minW: 0,
    h: "42px",
    overflow: "hidden",
    px: "12px",
    border: "1px solid",
    borderColor: "rgba(38, 57, 111, 0.18)",
    borderRadius: "999px",
    bg: "app.white",
    boxShadow: "0 3px 10px rgba(38, 57, 111, 0.08)",
    textAlign: "left",
    transition: "border-color 140ms ease, box-shadow 140ms ease",
    _hover: {
      borderColor: "rgba(38, 57, 111, 0.26)",
      boxShadow: "0 4px 13px rgba(38, 57, 111, 0.11)",
    },
    _active: {
      borderColor: "rgba(38, 57, 111, 0.28)",
      boxShadow: "0 2px 8px rgba(38, 57, 111, 0.08)",
    },
  },
  filterSummaryText: {
    display: "block",
    maxW: "100%",
    overflow: "hidden",
    fontSize: "sm",
    fontWeight: "semibold",
    lineHeight: 1.25,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  connectionsButton: (isSelected: boolean) =>
    ({
      display: "grid",
      placeItems: "center",
      boxSize: "42px",
      minW: "42px",
      border: "1px solid",
      borderColor: "rgba(38, 57, 111, 0.18)",
      borderRadius: "999px",
      color: "app.text",
      bg: isSelected ? "app.bgAux" : "app.white",
      boxShadow: "0 3px 10px rgba(38, 57, 111, 0.08)",
      transition: "background 140ms ease, border-color 140ms ease",
      _disabled: { opacity: 1 },
      _hover: {
        bg: isSelected ? "app.bgAux" : "app.white",
        borderColor: "rgba(38, 57, 111, 0.26)",
      },
      _active: {
        bg: isSelected ? "app.bgAux" : "app.white",
        borderColor: "rgba(38, 57, 111, 0.28)",
      },
    }) as const,
  headerPanel: {
    h: "calc(100% - 56px)",
    overflowY: "auto",
    px: "18px",
    pt: "22px",
    pb: "32px",
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
    top: "-5px",
    right: "-8px",
    alignItems: "center",
    justifyContent: "center",
    minW: "20px",
    h: "20px",
    px: "4px",
    border: "2px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    bg: "#F97316",
    color: "app.white",
    fontSize: "11px",
    fontWeight: "black",
    lineHeight: 1,
    boxShadow: "0 1px 4px rgba(38, 57, 111, 0.28)",
  },
  filterForm: {
    display: "grid",
    gap: "16px",
  },
  filterAgeGrid: {
    columns: 2,
    gap: "10px",
  },
} as const;

function formatFilterSummary(settings: DiscoverySettingsData) {
  return `${settings.location}, ${settings.ageFrom}-${settings.ageTo} rokov, ${settings.radiusKm} km`;
}

function MatchIconWithCount({ count }: { count: number }) {
  return (
    <Flex {...styles.matchIconWrap}>
      <SvgImage src={matchIcon} boxSize="28px" {...styles.matchIconImage} />
      {count > 0 && (
        <Flex as="span" {...styles.matchIconCount}>
          {count > 99 ? "99+" : count}
        </Flex>
      )}
    </Flex>
  );
}

type MatchInfoPanelProps = {
  isLoading: boolean;
  matches: ChatMatch[];
  onMatchClick: (matchId: string) => void;
};

function MatchInfoPanel({
  isLoading,
  matches,
  onMatchClick,
}: MatchInfoPanelProps) {
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
      <ChatMatchList matches={matches} onMatchClick={onMatchClick} />
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

type ActiveHeaderPanel = "filter" | "matches" | null;

type DiscoveryHeaderProps = {
  initialDiscoverySettings: DiscoverySettingsData;
  isLoadingMatches: boolean;
  matches: ChatMatch[];
  onMatchClick: (matchId: string) => void;
  onNewMatchesSeen: (matchIds: string[]) => void;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
};

function DiscoveryHeader({
  initialDiscoverySettings,
  isLoadingMatches,
  matches,
  onMatchClick,
  onNewMatchesSeen,
  onDiscoveryReload,
  onDiscoverySettingsSave,
}: DiscoveryHeaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activePanel, setActivePanel] = useState<ActiveHeaderPanel>(null);
  const [expandedTop, setExpandedTop] = useState<number | null>(null);
  const [expandedPanelMatches, setExpandedPanelMatches] = useState<ChatMatch[]>(
    [],
  );
  const newMatches = matches.filter(
    (match) => match.isNew && !match.lastMessage,
  );
  const isExpanded = activePanel !== null;
  const isFilterExpanded = activePanel === "filter";
  const isMatchesExpanded = activePanel === "matches";
  const canUseMatches =
    isLoadingMatches ||
    isMatchesExpanded ||
    newMatches.length > 0 ||
    expandedPanelMatches.length > 0;
  const displayedNewMatches =
    expandedPanelMatches.length > 0 ? expandedPanelMatches : newMatches;

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isExpanded]);

  const openPanel = (panel: Exclude<ActiveHeaderPanel, null>) => {
    setExpandedTop(rootRef.current?.getBoundingClientRect().top ?? 64);
    setActivePanel(panel);
  };

  const toggleFilterPanel = () => {
    setExpandedPanelMatches([]);
    setActivePanel((currentPanel) => {
      if (currentPanel === "filter") {
        return null;
      }

      setExpandedTop(rootRef.current?.getBoundingClientRect().top ?? 64);
      return "filter";
    });
  };

  const toggleMatchesPanel = () => {
    if (!canUseMatches) {
      return;
    }

    if (isMatchesExpanded) {
      setActivePanel(null);
      return;
    }

    openPanel("matches");

    if (newMatches.length === 0) {
      return;
    }

    setExpandedPanelMatches(newMatches);
    onNewMatchesSeen(newMatches.map((match) => match.id));
  };

  return (
    <Box
      ref={rootRef}
      {...styles.headerRoot(isExpanded, expandedTop, 64)}
      aria-live="polite"
    >
      <Flex {...styles.headerRow}>
        <Flex
          as="button"
          type="button"
          aria-expanded={isFilterExpanded}
          aria-label={
            isFilterExpanded ? "Zbaliť filter" : "Rozbaliť filter"
          }
          onClick={toggleFilterPanel}
          {...styles.filterToggle}
        >
          <SvgImage src={filterIcon} boxSize="21px" {...styles.infoIcon} />
          <Text as="span" {...styles.filterSummaryText}>
            {formatFilterSummary(initialDiscoverySettings)}
          </Text>
        </Flex>

        <IconButton
          aria-label={
            isMatchesExpanded
              ? "Zavrieť nové prepojenia"
              : "Zobraziť nové prepojenia"
          }
          aria-pressed={isMatchesExpanded}
          icon={
            <MatchIconWithCount count={newMatches.length} />
          }
          isDisabled={!canUseMatches}
          onClick={toggleMatchesPanel}
          {...styles.connectionsButton(isMatchesExpanded)}
        />
      </Flex>

      {isExpanded && (
        <Box {...styles.headerPanel}>
          {isFilterExpanded ? (
            <DiscoveryFilterPanel
              key={formatFilterSummary(initialDiscoverySettings)}
              initialSettings={initialDiscoverySettings}
              onDiscoveryReload={onDiscoveryReload}
              onSave={onDiscoverySettingsSave}
            />
          ) : (
            <MatchInfoPanel
              isLoading={isLoadingMatches}
              matches={displayedNewMatches}
              onMatchClick={onMatchClick}
            />
          )}
        </Box>
      )}
    </Box>
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
  const navigate = useNavigate();
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
  const handleNewMatchesSeen = useCallback(
    (matchIds: string[]) => {
      if (matchIds.length === 0) {
        return;
      }

      const seenMatchIds = new Set(matchIds);
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          seenMatchIds.has(match.id) ? { ...match, isNew: false } : match,
        ),
      );

      apiClient.markChatMatchesSeen(matchIds).catch(() => {
        void loadMatches();
      });
    },
    [loadMatches],
  );
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
            <DiscoveryHeader
              initialDiscoverySettings={initialDiscoverySettings}
              isLoadingMatches={isLoadingMatches}
              matches={matches}
              onMatchClick={(matchId) => navigate(`/messages/${matchId}`)}
              onNewMatchesSeen={handleNewMatchesSeen}
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
