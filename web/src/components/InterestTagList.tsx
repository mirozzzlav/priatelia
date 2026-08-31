import { Box, Button, Flex, Text } from "@chakra-ui/react";

import type { InterestTag } from "src/features/interests/types";

const styles = {
  list: {
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    alignItems: "center",
    gap: "7px",
    px: "12px",
    py: "6px",
    border: "1px solid",
    borderColor: "app.textAlt",
    borderRadius: "999px",
    bg: "app.bgAux",
    color: "app.textAlt",
    fontSize: "sm",
    fontWeight: "bold",
  },
  removeButton: {
    display: "grid",
    placeItems: "center",
    boxSize: "22px",
    minW: "22px",
    borderRadius: "999px",
    bg: "app.white",
    color: "app.textAlt",
    transform: "translateY(1px)",
    transition: "background 140ms ease, color 140ms ease",
    _active: {
      bg: "app.textAlt",
      color: "app.white",
    },
    _hover: {
      bg: "app.textAlt",
      color: "app.white",
    },
  },
  removeIcon: {
    position: "relative",
    boxSize: "12px",
    _before: {
      content: '""',
      position: "absolute",
      top: "50%",
      left: 0,
      w: "100%",
      h: "3px",
      borderRadius: "999px",
      bg: "currentColor",
      transform: "translateY(-50%) rotate(45deg)",
    },
    _after: {
      content: '""',
      position: "absolute",
      top: "50%",
      left: 0,
      w: "100%",
      h: "3px",
      borderRadius: "999px",
      bg: "currentColor",
      transform: "translateY(-50%) rotate(-45deg)",
    },
  },
} as const;

type InterestTagListProps = {
  onRemove?: (interestId: string) => void;
  tags: InterestTag[];
};

export function InterestTagList({ onRemove, tags }: InterestTagListProps) {
  return (
    <Flex {...styles.list}>
      {tags.map((tag) => (
        <Flex key={tag.id} {...styles.tag}>
          <Text as="span">{tag.name}</Text>
          {onRemove && (
            <Button
              aria-label={`Odstrániť záujem ${tag.name}`}
              onClick={() => onRemove(tag.id)}
              type="button"
              variant="unstyled"
              {...styles.removeButton}
            >
              <Box aria-hidden="true" {...styles.removeIcon} />
            </Button>
          )}
        </Flex>
      ))}
    </Flex>
  );
}
