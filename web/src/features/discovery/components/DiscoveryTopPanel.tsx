import { Box } from "@chakra-ui/react";

import { HeaderSurface } from "src/components/HeaderSurface";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { DiscoveryFilterBar } from "src/features/discovery/components/DiscoveryFilterBar";
import { DiscoveryMatchesPanel } from "src/features/discovery/components/DiscoveryMatchesPanel";
import { useDiscoveryTopPanelState } from "src/features/discovery/hooks/useDiscoveryTopPanelState";
import type { ChatMatch } from "src/services/api";

type DiscoveryTopPanelProps = {
  initialDiscoverySettings: DiscoverySettingsData;
  isLoadingMatches: boolean;
  matches: ChatMatch[];
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
  onMatchClick: (matchId: string) => void;
  onNewMatchesSeen: (matchIds: string[]) => void;
};

const styles = {
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
      w: isExpanded ? "min(100%, 460px)" : undefined,
      h: isExpanded ? `calc(100dvh - ${expandedTop ?? topOffset}px)` : "112px",
      overflow: isExpanded ? "hidden" : "visible",
      transform: isExpanded ? "translateX(-50%)" : undefined,
      transition:
        "height 220ms ease, box-shadow 220ms ease, background 220ms ease",
    }) as const,
  topPanelContent: {
    h: "calc(100% - 112px)",
    overflowY: "auto",
    px: "18px",
    pt: "22px",
    pb: "32px",
  },
} as const;

export function DiscoveryTopPanel({
  initialDiscoverySettings,
  isLoadingMatches,
  matches,
  onDiscoveryReload,
  onDiscoverySettingsSave,
  onMatchClick,
  onNewMatchesSeen,
}: DiscoveryTopPanelProps) {
  const {
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
  } = useDiscoveryTopPanelState({
    initialDiscoverySettings,
    isLoadingMatches,
    matches,
    onDiscoveryReload,
    onDiscoverySettingsSave,
    onNewMatchesSeen,
  });

  return (
    <HeaderSurface
      ref={rootRef}
      isExpanded={isExpanded}
      {...styles.headerRoot(isExpanded, expandedTop, 64)}
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

      {isExpanded && (
        <Box {...styles.topPanelContent}>
          <DiscoveryMatchesPanel
            isLoading={isLoadingMatches}
            matches={displayedNewMatches}
            onMatchClick={onMatchClick}
          />
        </Box>
      )}
    </HeaderSurface>
  );
}
