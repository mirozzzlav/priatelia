import { Box, Text } from "@chakra-ui/react";

import { getGenderFilterSummary } from "src/constants/gender";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import type { InlineFilterField } from "src/features/discovery/types";
import { discoveryFilterStyles as styles } from "src/features/discovery/components/discoveryFilterStyles";

type FilterSummarySegmentsProps = {
  onEdit: (field: InlineFilterField) => void;
  settings: DiscoverySettingsData;
};

export function FilterSummarySegments({
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
