import { HeaderSurface } from "src/components/HeaderSurface";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { DiscoveryFilterBar } from "src/features/discovery/components/DiscoveryFilterBar";
import { useDiscoveryTopPanelState } from "src/features/discovery/hooks/useDiscoveryTopPanelState";

type DiscoveryTopPanelProps = {
  initialDiscoverySettings: DiscoverySettingsData;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
};

const styles = {
  headerRoot: {
    position: "relative",
    zIndex: 1,
    h: "112px",
    overflow: "visible",
  },
} as const;

export function DiscoveryTopPanel({
  initialDiscoverySettings,
  onDiscoveryReload,
  onDiscoverySettingsSave,
}: DiscoveryTopPanelProps) {
  const {
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
  } = useDiscoveryTopPanelState({
    initialDiscoverySettings,
    onDiscoveryReload,
    onDiscoverySettingsSave,
  });

  return (
    <HeaderSurface
      ref={rootRef}
      {...styles.headerRoot}
      aria-live="polite"
    >
      <DiscoveryFilterBar
        activeInlineFilter={activeInlineFilter}
        draftSettings={draftSettings}
        filterRef={filterRef}
        initialDiscoverySettings={initialDiscoverySettings}
        isSavingInlineFilter={isSavingInlineFilter}
        onDraftFieldChange={updateDraftField}
        onDraftGenderPreferencesChange={updateDraftGenderPreferences}
        onEditInlineFilter={editInlineFilter}
        onInlineFilterSave={saveCurrentInlineFilter}
        onLocationQueryChange={updateLocationQuery}
        onLocationSelect={selectInlineLocation}
      />
    </HeaderSurface>
  );
}
