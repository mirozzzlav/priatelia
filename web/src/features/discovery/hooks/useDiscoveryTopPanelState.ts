import { useEffect, useRef, useState } from "react";

import type { Gender } from "src/constants/gender";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import type { InlineFilterField } from "src/features/discovery/types";
import { apiClient, type LocationOption } from "src/services/api";

type UseDiscoveryTopPanelStateParams = {
  initialDiscoverySettings: DiscoverySettingsData;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
};

export function useDiscoveryTopPanelState({
  initialDiscoverySettings,
  onDiscoveryReload,
  onDiscoverySettingsSave,
}: UseDiscoveryTopPanelStateParams) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [activeInlineFilter, setActiveInlineFilter] =
    useState<InlineFilterField | null>(null);
  const [draftSettings, setDraftSettings] = useState<DiscoverySettingsData>(
    initialDiscoverySettings,
  );
  const [isSavingInlineFilter, setIsSavingInlineFilter] = useState(false);

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
    draftSettings,
    filterRef,
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
