import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import type { PersonPreview } from "src/features/person-preview/types";

const styles = {
  root: {
    position: "sticky",
    top: "64px",
    zIndex: 8,
    mx: "-16px",
    px: "16px",
    pt: "14px",
    pb: "12px",
    color: "app.white",
    bgGradient: "linear(to-r, app.base, app.baseDark)",
    borderBottom: "1px solid",
    borderColor: "app.white",
    backdropFilter: "blur(18px)",
    sx: {
      "@media (max-width: 390px)": {
        mx: "-12px",
        p: "12px",
      },
    },
  },
  headingRow: {
    align: "baseline",
    gap: "10px",
    mb: "8px",
    minW: 0,
  },
  name: {
    m: 0,
    minW: 0,
    overflow: "hidden",
    fontSize: { base: "2xl", sm: "3xl" },
    lineHeight: 1,
    letterSpacing: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    _after: { content: '","' },
    fontWeight: "normal",
  },
  age: {
    flexShrink: 0,
    fontSize: "3xl",
    fontWeight: "semibold",
    color: "app.info",
  },
  metaList: {
    flexWrap: "wrap",
    gap: "8px",
    minW: 0,
  },
  metaItem: {
    px: "14px",
    py: "7px",
    borderRadius: "999px",
    bg: "app.baseDark",
    color: "app.white",
    fontSize: "sm",
    fontWeight: "semibold",
  },
} as const;

type PersonPreviewToolbarProps = {
  person: PersonPreview;
};

export function PersonPreviewToolbar({ person }: PersonPreviewToolbarProps) {
  return (
    <Box {...styles.root}>
      <Flex {...styles.headingRow}>
        <Heading as="h1" {...styles.name}>
          {person.name}
        </Heading>
        <Text {...styles.age}>{person.age}</Text>
      </Flex>

      <Flex {...styles.metaList}>
        {person.meta.map((item) => (
          <Text key={item} {...styles.metaItem}>
            {item}
          </Text>
        ))}
      </Flex>
    </Box>
  );
}
