import { Flex, Text } from "@chakra-ui/react";
import type { RefObject } from "react";

import slidersIcon from "assets/sliders.svg";
import { SvgImage } from "src/components/SvgImage";
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
  isSavingInlineFilter: boolean;
  onDraftFieldChange: (field: keyof DiscoverySettingsData, value: string) => void;
  onDraftGenderPreferencesChange: (genderPreferences: Gender[]) => void;
  onEditInlineFilter: (field: InlineFilterField) => void;
  onInlineFilterSave: () => void;
  onLocationQueryChange: (location: string) => void;
  onLocationSelect: (option: LocationOption) => void;
};

const styles = {
  headerRow: {
    align: "stretch",
    direction: "column",
    justify: "center",
    w: "100%",
    h: "100%",
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
} as const;

export function DiscoveryFilterBar({
  activeInlineFilter,
  draftSettings,
  filterRef,
  initialDiscoverySettings,
  isSavingInlineFilter,
  onDraftFieldChange,
  onDraftGenderPreferencesChange,
  onEditInlineFilter,
  onInlineFilterSave,
  onLocationQueryChange,
  onLocationSelect,
}: DiscoveryFilterBarProps) {
  return (
    <Flex {...styles.headerRow}>
      <Flex {...styles.filterLabel}>
        <SvgImage src={slidersIcon} {...styles.filterLabelIcon} />
        <Text as="span">Kritériá hľadania</Text>
      </Flex>
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
    </Flex>
  );
}
