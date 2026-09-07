import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  discoveryMatchesSummaryEvent,
  toggleDiscoveryMatchesEvent,
} from "src/components/TopBar";
import type { Gender } from "src/constants/gender";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import type { InlineFilterField } from "src/features/discovery/types";
import {
  apiClient,
  type ChatMatch,
  type LocationOption,
} from "src/services/api";

type UseDiscoveryTopPanelStateParams = {
  initialDiscoverySettings: DiscoverySettingsData;
  isLoadingMatches: boolean;
  matches: ChatMatch[];
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
  onNewMatchesSeen: (matchIds: string[]) => void;
};

type ActiveTopPanel = "matches" | null;

export function useDiscoveryTopPanelState({
  initialDiscoverySettings,
  isLoadingMatches,
  matches,
  onDiscoveryReload,
  onDiscoverySettingsSave,
  onNewMatchesSeen,
}: UseDiscoveryTopPanelStateParams) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [activePanel, setActivePanel] = useState<ActiveTopPanel>(null);
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
  const newMatches = useMemo(
    () => matches.filter((match) => match.isNew && !match.lastMessage),
    [matches],
  );
  const isExpanded = activePanel !== null;
  const isMatchesExpanded = activePanel === "matches";
  const canUseMatches =
    isLoadingMatches ||
    isMatchesExpanded ||
    newMatches.length > 0 ||
    expandedPanelMatches.length > 0;
  const displayedNewMatches = useMemo(
    () => (expandedPanelMatches.length > 0 ? expandedPanelMatches : newMatches),
    [expandedPanelMatches, newMatches],
  );

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

  const openPanel = useCallback((panel: NonNullable<ActiveTopPanel>) => {
    setExpandedTop(rootRef.current?.getBoundingClientRect().top ?? 64);
    setActivePanel(panel);
  }, []);

  const toggleMatchesPanel = useCallback(() => {
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
  }, [
    canUseMatches,
    isMatchesExpanded,
    newMatches,
    onNewMatchesSeen,
    openPanel,
  ]);

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
  }, [toggleMatchesPanel]);

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

  const updateLocationQuery = (location: string) => {
    setDraftSettings((current) => ({
      ...current,
      location,
      locationLatitude: null,
      locationLongitude: null,
    }));
  };

  const saveCurrentInlineFilter = () => {
    void saveInlineFilter();
  };

  return {
    activeInlineFilter,
    displayedNewMatches,
    draftSettings,
    expandedTop,
    filterRef,
    isExpanded,
    isSavingInlineFilter,
    rootRef,
    saveCurrentInlineFilter,
    selectInlineLocation,
    updateDraftField,
    updateDraftGenderPreferences,
    updateLocationQuery,
    editInlineFilter,
  };
}
