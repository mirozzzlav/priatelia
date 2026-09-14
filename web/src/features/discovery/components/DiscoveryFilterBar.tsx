import { Flex, Icon } from "@chakra-ui/react";
import type { RefObject } from "react";

import slidersIcon from "assets/sliders.svg";
import { SvgImage } from "src/components/SvgImage";
import { SurfaceLabel } from "src/components/SurfaceLabel";
import type { Gender } from "src/constants/gender";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { FilterSummarySegments } from "src/features/discovery/components/FilterSummarySegments";
import { InlineGenderFilterEditor } from "src/features/discovery/components/InlineGenderFilterEditor";
import { InlineLocationFilterEditor } from "src/features/discovery/components/InlineLocationFilterEditor";
import { InlineNumericFilterEditor } from "src/features/discovery/components/InlineNumericFilterEditor";
import type { InlineFilterField } from "src/features/discovery/types";
import type { LocationOption } from "src/services/api";

type DiscoveryFilterBarProps = {
  activeInlineFilter: InlineFilterField | null;
  draftSettings: DiscoverySettingsData;
  filterRef: RefObject<HTMLDivElement | null>;
  initialDiscoverySettings: DiscoverySettingsData;
  isFilterPanelOpen: boolean;
  isSavingInlineFilter: boolean;
  onDraftFieldChange: (field: keyof DiscoverySettingsData, value: string) => void;
  onDraftGenderPreferencesChange: (genderPreferences: Gender[]) => void;
  onEditInlineFilter: (field: InlineFilterField) => void;
  onInlineFilterSave: () => void;
  onLocationQueryChange: (location: string) => void;
  onLocationSelect: (option: LocationOption) => void;
  onToggleFilterPanel: () => void;
};

const styles = {
  headerRow: {
    align: "stretch",
    direction: "column",
    justify: "center",
    w: "100%",
    h: "100%",
    gap: "10px",
  },
  filterLabelIcon: {
    boxSize: { base: "17px", sm: "18px" },
  },
  chevronIcon: (isOpen: boolean) =>
    ({
      boxSize: "16px",
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 140ms ease",
    }) as const,
  filterToggle: {
    align: "center",
    display: "flex",
    flex: 1,
    minW: 0,
    h: "60px",
    px: { base: "12px", sm: "16px" },
    py: "7px",
    border: "1px solid",
    borderColor: "app.borderColor",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.94)",
    boxShadow: "0 7px 18px rgba(53, 87, 45, 0.08)",
    textAlign: "left",
    transition: "border-color 140ms ease, box-shadow 140ms ease",
    _hover: {
      borderColor: "app.borderColorStrong",
      boxShadow: "0 9px 22px rgba(53, 87, 45, 0.11)",
    },
    _active: {
      borderColor: "app.borderColorStrong",
      boxShadow: "0 2px 8px rgba(53, 87, 45, 0.08)",
    },
    _focusWithin: {
      borderColor: "app.borderColorStrong",
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.12)",
    },
  },
} as const;

export function DiscoveryFilterBar({
  activeInlineFilter,
  draftSettings,
  filterRef,
  initialDiscoverySettings,
  isFilterPanelOpen,
  isSavingInlineFilter,
  onDraftFieldChange,
  onDraftGenderPreferencesChange,
  onEditInlineFilter,
  onInlineFilterSave,
  onLocationQueryChange,
  onLocationSelect,
  onToggleFilterPanel,
}: DiscoveryFilterBarProps) {
  return (
    <Flex {...styles.headerRow}>
      <SurfaceLabel
        aria-expanded={isFilterPanelOpen}
        aria-label={
          isFilterPanelOpen
            ? "Skryť kritériá hľadania"
            : "Zobraziť kritériá hľadania"
        }
        icon={<SvgImage src={slidersIcon} {...styles.filterLabelIcon} />}
        onClick={onToggleFilterPanel}
        rightIcon={<ChevronIcon {...styles.chevronIcon(isFilterPanelOpen)} />}
        title="Kritériá hľadania"
      />
      {isFilterPanelOpen && (
        <Flex ref={filterRef} {...styles.filterToggle}>
          {activeInlineFilter === null ? (
            <FilterSummarySegments
              onEdit={onEditInlineFilter}
              settings={initialDiscoverySettings}
            />
          ) : activeInlineFilter === "location" ? (
            <InlineLocationFilterEditor
              isSaving={isSavingInlineFilter}
              onQueryChange={onLocationQueryChange}
              onSelect={onLocationSelect}
              query={draftSettings.location}
            />
          ) : activeInlineFilter === "gender" ? (
            <InlineGenderFilterEditor
              genderPreferences={draftSettings.genderPreferences}
              isSaving={isSavingInlineFilter}
              onChange={onDraftGenderPreferencesChange}
              onConfirm={onInlineFilterSave}
            />
          ) : (
            <InlineNumericFilterEditor
              draftSettings={draftSettings}
              field={activeInlineFilter}
              isSaving={isSavingInlineFilter}
              onChange={onDraftFieldChange}
              onConfirm={onInlineFilterSave}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}

function ChevronIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
      aria-hidden="true"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}
