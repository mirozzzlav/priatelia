import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { PersonPreviewActionButtons } from "src/features/person-preview/components/PersonPreviewActionButtons";
import type {
  ActivePersonPreviewAction,
  PersonPreview,
  PersonPreviewActionHandlers,
} from "src/features/person-preview/types";

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
  summary: {
    mb: "12px",
  },
  headingRow: {
    align: "baseline",
    gap: "10px",
    mb: "8px",
  },
  name: {
    m: 0,
    fontSize: "3xl",
    lineHeight: 1,
    letterSpacing: 0,
    _after: { content: '","' },
  },
  age: {
    fontSize: "3xl",
    fontWeight: "bold",
    color: "app.info",
  },
  metaList: {
    flexWrap: "wrap",
    gap: "8px",
    mb: "18px",
  },
  metaItem: {
    px: "10px",
    py: "7px",
    border: "1px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    bg: "app.base",
    color: "app.white",
    fontSize: "xs",
    fontWeight: "bold",
    backdropFilter: "blur(10px)",
  },
} as const;

type PersonPreviewToolbarProps = PersonPreviewActionHandlers & {
  activeAction: ActivePersonPreviewAction;
  isSubmitting: boolean;
  person: PersonPreview;
};

export function PersonPreviewToolbar({
  activeAction,
  isSubmitting,
  person,
  onActionEnd,
  onActionStart,
}: PersonPreviewToolbarProps) {
  return (
    <Box {...styles.root}>
      <Box {...styles.summary}>
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

      <PersonPreviewActionButtons
        activeAction={activeAction}
        isSubmitting={isSubmitting}
        onActionEnd={onActionEnd}
        onActionStart={onActionStart}
      />
    </Box>
  );
}
