import { SurfaceBand } from "src/components/SurfaceBand";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { DiscoveryFilterBar } from "src/features/discovery/components/DiscoveryFilterBar";
import { useDiscoveryTopPanelState } from "src/features/discovery/hooks/useDiscoveryTopPanelState";

type DiscoveryTopPanelProps = {
  initialDiscoverySettings: DiscoverySettingsData;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
};

const styles = {
  headerRoot: (isExpanded: boolean) =>
    ({
    position: "relative",
    zIndex: 1,
      h: isExpanded ? "112px" : "51px",
    overflow: "visible",
    borderTop: 0,
    }) as const,
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
    isFilterPanelOpen,
    toggleFilterPanel,
  } = useDiscoveryTopPanelState({
    initialDiscoverySettings,
    onDiscoveryReload,
    onDiscoverySettingsSave,
  });

  return (
    <SurfaceBand
      ref={rootRef}
      {...styles.headerRoot(isFilterPanelOpen)}
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
        isFilterPanelOpen={isFilterPanelOpen}
        onLocationQueryChange={updateLocationQuery}
        onLocationSelect={selectInlineLocation}
        onToggleFilterPanel={toggleFilterPanel}
      />
    </SurfaceBand>
  );
}
