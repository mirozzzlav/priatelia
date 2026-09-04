import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import type { PersonPreview } from "src/features/person-preview/types";
import { getSlovakCountWord } from "src/utils/formatSlovakCount";

const styles = {
  root: {
    px: "18px",
    py: "14px",
    color: "app.text",
    bg: "app.white",
  },
  contentRow: {
    align: "center",
    minW: 0,
    w: "100%",
    justify: "flex-start",
  },
  name: {
    m: 0,
    minW: 0,
    maxW: { base: "48%", sm: "56%" },
    overflow: "hidden",
    fontSize: { base: "xl", sm: "2xl" },
    lineHeight: 1,
    letterSpacing: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "extrabold",
  },
  age: {
    flexShrink: 0,
    fontSize: { base: "xl", sm: "2xl" },
    fontWeight: "medium",
    color: "app.info",
  },
  city: {
    flexShrink: 1,
    maxW: { base: "24%", sm: "30%" },
    minW: 0,
    overflow: "hidden",
    color: "app.text",
    fontSize: { base: "xl", sm: "2xl" },
    fontWeight: "medium",
    lineHeight: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  punctuation: {
    flexShrink: 0,
    color: "app.text",
    fontSize: { base: "xl", sm: "2xl" },
    fontWeight: "medium",
    lineHeight: 1,
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
      <Flex {...styles.contentRow}>
        <Heading as="h1" {...styles.name}>
          {person.name}
        </Heading>
        {city && (
          <>
            <Text {...styles.punctuation}>,&nbsp;</Text>
            <Text {...styles.city}>{city}</Text>
            <Text {...styles.punctuation}>,&nbsp;</Text>
          </>
        )}
        <Text {...styles.age}>{ageText}</Text>
      </Flex>
    </Box>
  );
}
