import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import locationPinIcon from "assets/location-pin.svg";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import type { PersonPreview } from "src/features/person-preview/types";
import { getSlovakCountWord } from "src/utils/formatSlovakCount";

const styles = {
  root: {
    position: "relative",
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "26px", sm: "30px" },
    py: "17px",
    color: "app.text",
    borderTop: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.08)",
    bgGradient:
      "linear(to-b, rgba(241, 243, 246, 0.55), rgba(255, 255, 255, 0) 58%)",
  },
  identityRow: {
    align: "center",
    minW: 0,
    w: "100%",
  },
  identityGroup: {
    align: "center",
    columnGap: { base: "9px", sm: "11px" },
    minW: 0,
    maxW: "100%",
  },
  name: {
    m: 0,
    minW: 0,
    overflow: "hidden",
    color: "app.text",
    fontSize: { base: "2xl", sm: "3xl" },
    lineHeight: 1.05,
    letterSpacing: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "black",
  },
  age: {
    flexShrink: 0,
    fontSize: { base: "2xl", sm: "3xl" },
    fontWeight: "bold",
    color: "app.text",
    lineHeight: 1.05,
  },
  identityDivider: {
    flexShrink: 0,
    alignSelf: "center",
    w: "1px",
    h: { base: "22px", sm: "26px" },
    bg: "rgba(53, 87, 45, 0.22)",
  },
  metaRow: {
    mt: { base: "9px", sm: "11px" },
    minW: 0,
  },
} as const;

type PersonPreviewToolbarProps = {
  person: PersonPreview;
};

export function PersonPreviewToolbar({ person }: PersonPreviewToolbarProps) {
  const city = person.meta[0];
  const ageValue = Number.parseInt(person.age, 10);
  const ageText = Number.isNaN(ageValue)
    ? person.age
    : `${ageValue} ${getSlovakCountWord("rok", ageValue)}`;

  return (
    <Box {...styles.root}>
      <Flex {...styles.identityRow}>
        <Flex {...styles.identityGroup}>
          <Heading as="h1" {...styles.name}>
            {person.name}
          </Heading>
          <Box aria-hidden="true" {...styles.identityDivider} />
          <Text {...styles.age}>{ageText}</Text>
        </Flex>
      </Flex>
      {city && (
        <Box {...styles.metaRow}>
          <ProfileMetaTag
            icon={locationPinIcon}
            iconFilter="invert(53%) sepia(28%) saturate(833%) hue-rotate(62deg) brightness(90%) contrast(87%)"
            type="default"
          >
            {city}
          </ProfileMetaTag>
        </Box>
      )}
    </Box>
  );
}
