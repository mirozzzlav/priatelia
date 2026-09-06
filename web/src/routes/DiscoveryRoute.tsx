import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import slidersIcon from "assets/sliders.svg";
import personIcon from "assets/person.svg";
import { FormInput } from "src/components/formElements";
import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { PanelHeading } from "src/components/PanelHeading";
import { PhotoViewer } from "src/components/PhotoViewer";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import { ScrollCue } from "src/components/ScrollCue";
import { SvgImage } from "src/components/SvgImage";
import {
  getGenderFilterSummary,
  type Gender,
} from "src/constants/gender";
import {
  discoveryMatchesSummaryEvent,
  toggleDiscoveryMatchesEvent,
} from "src/components/TopBar";
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
  type LocationOption,
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
      h: isExpanded ? `calc(100dvh - ${expandedTop ?? topOffset}px)` : "96px",
      mx: isExpanded ? undefined : { base: "-12px", sm: "-16px" },
      bg: "linear-gradient(180deg, #ffffff 0%, #fbfcff 100%)",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "rgba(53, 87, 45, 0.14)",
      boxShadow: isExpanded
        ? "0 18px 42px rgba(53, 87, 45, 0.18)"
        : "0 18px 42px rgba(53, 87, 45, 0.12)",
      color: "app.text",
      overflow: isExpanded ? "hidden" : "visible",
      transform: isExpanded ? "translateX(-50%)" : undefined,
      transition:
        "height 220ms ease, box-shadow 220ms ease, background 220ms ease",
    }) as const,
  headerRow: {
    align: "stretch",
    direction: "column",
    justify: "center",
    w: "100%",
    h: "96px",
    px: "12px",
    pt: "10px",
    pb: "14px",
    gap: "8px",
  },
  filterLabel: {
    align: "center",
    gap: "7px",
    color: "app.baseDark",
    fontSize: { base: "xs", sm: "sm" },
    fontWeight: "black",
    lineHeight: 1,
    px: "4px",
    textTransform: "uppercase",
  },
  filterLabelIcon: {
    boxSize: { base: "17px", sm: "18px" },
  },
  filterToggle: {
    align: "center",
    display: "flex",
    flex: 1,
    minW: 0,
    h: "50px",
    px: "14px",
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.16)",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.94)",
    boxShadow: "0 7px 18px rgba(53, 87, 45, 0.08)",
    textAlign: "left",
    transition: "border-color 140ms ease, box-shadow 140ms ease",
    _hover: {
      borderColor: "rgba(53, 87, 45, 0.26)",
      boxShadow: "0 9px 22px rgba(53, 87, 45, 0.11)",
    },
    _active: {
      borderColor: "rgba(53, 87, 45, 0.28)",
      boxShadow: "0 2px 8px rgba(53, 87, 45, 0.08)",
    },
    _focusWithin: {
      borderColor: "rgba(79, 131, 68, 0.38)",
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.12)",
    },
  },
  filterSummary: {
    align: "center",
    display: "grid",
    flex: 1,
    gridTemplateColumns:
      "minmax(0, 1.1fr) 13px minmax(42px, 0.48fr) 13px minmax(58px, 0.72fr) 13px minmax(45px, 0.45fr)",
    minW: 0,
  },
  filterSegment: {
    display: "grid",
    gap: "2px",
    minW: 0,
    overflow: "hidden",
    px: "3px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "semibold",
    lineHeight: 1.25,
    textAlign: "left",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    _hover: {
      color: "app.base",
    },
  },
  filterSegmentLabel: {
    color: "rgba(53, 87, 45, 0.62)",
    fontSize: "10px",
    fontWeight: "black",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  filterSegmentValue: {
    display: "block",
    minW: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  filterDivider: {
    justifySelf: "center",
    w: "1px",
    h: "34px",
    bg: "rgba(53, 87, 45, 0.24)",
  },
  filterEditorWrap: {
    position: "relative",
    flex: 1,
    minW: 0,
  },
  filterEditorGrid: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "38px minmax(0, 1fr) 38px",
    gap: "6px",
  },
  filterAgeEditorGrid: {
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "28px minmax(0, 1fr) minmax(0, 1fr) 38px",
    gap: "6px",
  },
  filterGenderEditor: {
    align: "center",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 38px",
    gap: "6px",
  },
  inlineGenderOptions: {
    flexWrap: "wrap",
    gap: "7px",
  },
  filterEditorLabel: {
    color: "rgba(53, 87, 45, 0.62)",
    fontSize: "10px",
    fontWeight: "black",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  inlineInput: {
    h: "38px",
    px: "10px",
    borderRadius: "999px",
    fontSize: "sm",
  },
  confirmButton: {
    display: "grid",
    placeItems: "center",
    boxSize: "38px",
    minW: "38px",
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.18)",
    borderRadius: "999px",
    bg: "app.white",
    color: "app.base",
    _hover: { bg: "app.bgAux" },
    _active: { bg: "app.bgAux" },
  },
  locationOptions: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    zIndex: 50,
    maxH: "196px",
    overflowY: "auto",
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.18)",
    borderRadius: "18px",
    bg: "app.white",
    boxShadow: "0 14px 32px rgba(53, 87, 45, 0.14)",
    p: "6px",
  },
  locationOption: {
    h: "auto",
    minH: "38px",
    w: "100%",
    justifyContent: "flex-start",
    px: "10px",
    py: "8px",
    borderRadius: "999px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "bold",
    textAlign: "left",
    whiteSpace: "normal",
    _hover: { bg: "app.bgAux", color: "app.text" },
    _focusVisible: {
      bg: "app.bgAux",
      boxShadow: "0 0 0 2px rgba(79, 131, 68, 0.22)",
      color: "app.text",
    },
  },
  inlineLoaderWrap: {
    h: "38px",
    w: "38px",
  },
  inlineLoader: {
    color: "app.base",
    opacity: 0.72,
    speed: "0.7s",
    thickness: "2px",
    size: "sm",
  },
  headerPanel: {
    h: "calc(100% - 96px)",
    overflowY: "auto",
    px: "18px",
    pt: "22px",
    pb: "32px",
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
} as const;

type InlineFilterField = "location" | "age" | "gender" | "radius";

function CheckMarkIcon() {
  return (
    <Icon viewBox="0 0 24 24" boxSize="18px" aria-hidden="true">
      <path
        d="M5 12.5 9.2 16.5 19 7.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
    </Icon>
  );
}

type FilterSummarySegmentsProps = {
  onEdit: (field: InlineFilterField) => void;
  settings: DiscoverySettingsData;
};

function FilterSummarySegments({
  onEdit,
  settings,
}: FilterSummarySegmentsProps) {
  return (
    <Box {...styles.filterSummary}>
      <Box
        as="button"
        type="button"
        aria-label="Upraviť lokalitu"
        onClick={() => onEdit("location")}
        {...styles.filterSegment}
      >
        <Text as="span" {...styles.filterSegmentLabel}>
          Mesto
        </Text>
        <Text as="span" {...styles.filterSegmentValue}>
          {settings.location}
        </Text>
      </Box>
      <Box aria-hidden="true" {...styles.filterDivider} />
      <Box
        as="button"
        type="button"
        aria-label="Upraviť vek"
        onClick={() => onEdit("age")}
        {...styles.filterSegment}
      >
        <Text as="span" {...styles.filterSegmentLabel}>
          Vek
        </Text>
        <Text as="span" {...styles.filterSegmentValue}>
          {settings.ageFrom}-{settings.ageTo}
        </Text>
      </Box>
      <Box aria-hidden="true" {...styles.filterDivider} />
      <Box
        as="button"
        type="button"
        aria-label="Upraviť pohlavie"
        onClick={() => onEdit("gender")}
        {...styles.filterSegment}
      >
        <Text as="span" {...styles.filterSegmentLabel}>
          Pohlavie
        </Text>
        <Text as="span" {...styles.filterSegmentValue}>
          {getGenderFilterSummary(settings.genderPreferences)}
        </Text>
      </Box>
      <Box aria-hidden="true" {...styles.filterDivider} />
      <Box
        as="button"
        type="button"
        aria-label="Upraviť radius"
        onClick={() => onEdit("radius")}
        {...styles.filterSegment}
      >
        <Text as="span" {...styles.filterSegmentLabel}>
          Radius
        </Text>
        <Text as="span" {...styles.filterSegmentValue}>
          {settings.radiusKm}
        </Text>
      </Box>
    </Box>
  );
}

type InlineLocationFilterEditorProps = {
  isSaving: boolean;
  onQueryChange: (location: string) => void;
  onSelect: (option: LocationOption) => void;
  query: string;
};

function InlineLocationFilterEditor({
  isSaving,
  onQueryChange,
  onSelect,
  query,
}: InlineLocationFilterEditorProps) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const latestQueryRef = useRef(query);
  const canSearch = query.trim().length >= 3;
  const visibleOptions = canSearch ? options : [];

  useEffect(() => {
    latestQueryRef.current = query;

    if (!canSearch) {
      return;
    }

    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      apiClient
        .searchLocations(query.trim())
        .then((results) => {
          if (!isActive || latestQueryRef.current.trim() !== query.trim()) {
            return;
          }

          setOptions(results);
        })
        .catch(() => {
          if (isActive) {
            setOptions([]);
          }
        })
        .finally(() => {
          if (isActive) {
            setIsSearching(false);
          }
        });
    }, 450);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [canSearch, query]);

  return (
    <Box {...styles.filterEditorWrap}>
      <Box {...styles.filterEditorGrid}>
        <Text as="span" {...styles.filterEditorLabel}>
          Mesto
        </Text>
        <InputGroup>
          <FormInput
            autoFocus
            aria-autocomplete="list"
            autoComplete="off"
            isDisabled={isSaving}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Mesto"
            role="combobox"
            value={query}
            {...styles.inlineInput}
          />
          {((canSearch && isSearching) || isSaving) && (
            <InputRightElement {...styles.inlineLoaderWrap}>
              <Spinner {...styles.inlineLoader} />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      {visibleOptions.length > 0 && !isSaving && (
        <Box role="listbox" {...styles.locationOptions}>
          {visibleOptions.map((option) => (
            <Button
              key={option.id}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(option);
              }}
              role="option"
              type="button"
              variant="ghost"
              {...styles.locationOption}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}

type InlineNumericFilterEditorProps = {
  draftSettings: DiscoverySettingsData;
  field: Exclude<InlineFilterField, "location" | "gender">;
  isSaving: boolean;
  onChange: (field: keyof DiscoverySettingsData, value: string) => void;
  onConfirm: () => void;
};

type InlineGenderFilterEditorProps = {
  genderPreferences: Gender[];
  isSaving: boolean;
  onChange: (genderPreferences: Gender[]) => void;
  onConfirm: () => void;
};

function InlineGenderFilterEditor({
  genderPreferences,
  isSaving,
  onChange,
  onConfirm,
}: InlineGenderFilterEditorProps) {
  const selectedValues = genderPreferences;

  const options: Array<{ label: string; value: Gender }> = [
    { label: "Muži", value: "male" },
    { label: "Ženy", value: "female" },
    { label: "Neuvedené", value: "unspecified" },
  ];
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );
  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value),
  );

  const toggleValue = (value: Gender) => {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    onChange(nextValues);
  };

  return (
    <Box {...styles.filterEditorWrap}>
      <Box {...styles.filterGenderEditor}>
        <Flex {...styles.inlineGenderOptions}>
          {selectedOptions.map((option) => (
            <ProfileMetaTag
              key={option.value}
              icon={personIcon}
              isSelected
              isDisabled={isSaving}
              onClick={() => toggleValue(option.value)}
              size="sm"
              type="default"
            >
              {option.label}
            </ProfileMetaTag>
          ))}
          {availableOptions.map((option) => (
            <ProfileMetaTag
              key={option.value}
              icon={personIcon}
              isDisabled={isSaving}
              onClick={() => toggleValue(option.value)}
              size="sm"
              type="default"
            >
              {option.label}
            </ProfileMetaTag>
          ))}
        </Flex>
        <IconButton
          aria-label="Potvrdiť pohlavie"
          icon={<CheckMarkIcon />}
          isDisabled={isSaving}
          onClick={onConfirm}
          {...styles.confirmButton}
        />
      </Box>
    </Box>
  );
}

function getDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function InlineNumericFilterEditor({
  draftSettings,
  field,
  isSaving,
  onChange,
  onConfirm,
}: InlineNumericFilterEditorProps) {
  if (field === "age") {
    return (
      <Box {...styles.filterEditorWrap}>
        <Box {...styles.filterAgeEditorGrid}>
          <Text as="span" {...styles.filterEditorLabel}>
            Vek
          </Text>
          <FormInput
            autoFocus
            aria-label="Vek od"
            inputMode="numeric"
            isDisabled={isSaving}
            onChange={(event) =>
              onChange("ageFrom", getDigitsOnly(event.target.value))
            }
            pattern="[0-9]*"
            type="text"
            value={draftSettings.ageFrom}
            {...styles.inlineInput}
          />
          <FormInput
            aria-label="Vek do"
            inputMode="numeric"
            isDisabled={isSaving}
            onChange={(event) =>
              onChange("ageTo", getDigitsOnly(event.target.value))
            }
            pattern="[0-9]*"
            type="text"
            value={draftSettings.ageTo}
            {...styles.inlineInput}
          />
          <IconButton
            aria-label="Potvrdiť vek"
            icon={<CheckMarkIcon />}
            isDisabled={isSaving}
            onClick={onConfirm}
            {...styles.confirmButton}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box {...styles.filterEditorWrap}>
      <Box {...styles.filterEditorGrid}>
        <Text as="span" {...styles.filterEditorLabel}>
          Radius
        </Text>
        <FormInput
          autoFocus
          aria-label="Radius"
          inputMode="numeric"
          isDisabled={isSaving}
          onChange={(event) =>
            onChange("radiusKm", getDigitsOnly(event.target.value))
          }
          pattern="[0-9]*"
          type="text"
          value={draftSettings.radiusKm}
          {...styles.inlineInput}
        />
        <IconButton
          aria-label="Potvrdiť radius"
          icon={<CheckMarkIcon />}
          isDisabled={isSaving}
          onClick={onConfirm}
          {...styles.confirmButton}
        />
      </Box>
    </Box>
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

type ActiveHeaderPanel = "matches" | null;

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
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [activePanel, setActivePanel] = useState<ActiveHeaderPanel>(null);
  const [activeInlineFilter, setActiveInlineFilter] =
    useState<InlineFilterField | null>(null);
  const [draftSettings, setDraftSettings] = useState<DiscoverySettingsData>(
    initialDiscoverySettings,
  );
  const [expandedTop, setExpandedTop] = useState<number | null>(null);
  const [expandedPanelMatches, setExpandedPanelMatches] = useState<ChatMatch[]>(
    [],
  );
  const [isSavingInlineFilter, setIsSavingInlineFilter] = useState(false);
  const newMatches = matches.filter(
    (match) => match.isNew && !match.lastMessage,
  );
  const isExpanded = activePanel !== null;
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

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(discoveryMatchesSummaryEvent, {
        detail: {
          canUseMatches,
          count: newMatches.length,
        },
      }),
    );
  }, [canUseMatches, newMatches.length]);

  const openPanel = (panel: NonNullable<ActiveHeaderPanel>) => {
    setExpandedTop(rootRef.current?.getBoundingClientRect().top ?? 64);
    setActivePanel(panel);
  };

  const toggleMatchesPanel = () => {
    setActiveInlineFilter(null);

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

  useEffect(() => {
    const handleToggleMatches = () => {
      toggleMatchesPanel();
    };

    window.addEventListener(toggleDiscoveryMatchesEvent, handleToggleMatches);

    return () => {
      window.removeEventListener(
        toggleDiscoveryMatchesEvent,
        handleToggleMatches,
      );
    };
  });

  useEffect(() => {
    if (activeInlineFilter === null) {
      return;
    }

    const closeInlineFilter = (event: PointerEvent) => {
      if (filterRef.current?.contains(event.target as Node)) {
        return;
      }

      setActiveInlineFilter(null);
    };

    document.addEventListener("pointerdown", closeInlineFilter);

    return () => {
      document.removeEventListener("pointerdown", closeInlineFilter);
    };
  }, [activeInlineFilter]);

  const editInlineFilter = (field: InlineFilterField) => {
    setActivePanel(null);
    setExpandedPanelMatches([]);
    setDraftSettings(initialDiscoverySettings);
    setActiveInlineFilter(field);
  };

  const updateDraftField = (
    field: keyof DiscoverySettingsData,
    value: string,
  ) => {
    setDraftSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateDraftGenderPreferences = (genderPreferences: Gender[]) => {
    setDraftSettings((current) => ({
      ...current,
      genderPreferences,
    }));
  };

  const saveInlineFilter = async (nextSettings = draftSettings) => {
    if (isSavingInlineFilter) {
      return;
    }

    setIsSavingInlineFilter(true);

    try {
      const response = await apiClient.updateDiscoverySettings(nextSettings);

      if (response.status === "error") {
        return;
      }

      onDiscoverySettingsSave(nextSettings);
      await onDiscoveryReload();
      setActiveInlineFilter(null);
    } finally {
      setIsSavingInlineFilter(false);
    }
  };

  const selectInlineLocation = (option: LocationOption) => {
    const nextSettings = {
      ...draftSettings,
      location: option.label,
      locationLatitude: option.latitude,
      locationLongitude: option.longitude,
    };

    setDraftSettings(nextSettings);
    void saveInlineFilter(nextSettings);
  };

  return (
    <Box
      ref={rootRef}
      {...styles.headerRoot(isExpanded, expandedTop, 64)}
      aria-live="polite"
    >
      <Flex {...styles.headerRow}>
        <Flex {...styles.filterLabel}>
          <SvgImage src={slidersIcon} {...styles.filterLabelIcon} />
          <Text as="span">Kritériá hľadania</Text>
        </Flex>
        <Flex ref={filterRef} {...styles.filterToggle}>
          {activeInlineFilter === null ? (
            <FilterSummarySegments
              onEdit={editInlineFilter}
              settings={initialDiscoverySettings}
            />
          ) : activeInlineFilter === "location" ? (
            <InlineLocationFilterEditor
              isSaving={isSavingInlineFilter}
              onQueryChange={(location) => {
                setDraftSettings((current) => ({
                  ...current,
                  location,
                  locationLatitude: null,
                  locationLongitude: null,
                }));
              }}
              onSelect={selectInlineLocation}
              query={draftSettings.location}
            />
          ) : activeInlineFilter === "gender" ? (
            <InlineGenderFilterEditor
              genderPreferences={draftSettings.genderPreferences}
              isSaving={isSavingInlineFilter}
              onChange={updateDraftGenderPreferences}
              onConfirm={() => {
                void saveInlineFilter();
              }}
            />
          ) : (
            <InlineNumericFilterEditor
              draftSettings={draftSettings}
              field={activeInlineFilter}
              isSaving={isSavingInlineFilter}
              onChange={updateDraftField}
              onConfirm={() => {
                void saveInlineFilter();
              }}
            />
          )}
        </Flex>
      </Flex>

      {isExpanded && (
        <Box {...styles.headerPanel}>
          <MatchInfoPanel
            isLoading={isLoadingMatches}
            matches={displayedNewMatches}
            onMatchClick={onMatchClick}
          />
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

  const discoveryHeader = (
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
  );

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
    const isEmptyDiscovery = error.includes("žiadneho nového priateľa");

    return (
      <Box {...styles.deck}>
        {isEmptyDiscovery && discoveryHeader}
        <InfoScreen
          message={error}
          title={isEmptyDiscovery ? "Žiadny nový priateľ" : "Chyba načítania"}
          variant={isEmptyDiscovery ? "info" : "error"}
        />
      </Box>
    );
  }

  return (
    <Box {...styles.deck}>
      {personPreview && (
        <>
          {discoveryHeader}
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
