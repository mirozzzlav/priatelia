import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import type { ChatMatch } from "src/services/api";

type ChatMatchListProps = {
  matches: ChatMatch[];
  onMatchClick: (matchId: string) => void;
};

const styles = {
  list: {
    display: "grid",
    gap: "10px",
  },
  matchButton: {
    h: "auto",
    minH: "76px",
    justifyContent: "flex-start",
    p: "10px",
    border: "1px solid",
    borderColor: "app.text",
    borderRadius: "12px",
    bg: "app.white",
    color: "app.text",
    textAlign: "left",
    _hover: { bg: "app.bgAux" },
    _active: { bg: "app.bgAux" },
  },
  photo: {
    boxSize: "54px",
    flexShrink: 0,
    borderRadius: "12px",
    objectFit: "cover",
  },
  matchContent: {
    minW: 0,
    flex: 1,
    direction: "column",
    gap: "3px",
  },
  matchName: {
    color: "app.text",
    fontSize: "md",
    fontWeight: "black",
  },
  matchMeta: {
    color: "app.text",
    fontSize: "xs",
    fontWeight: "bold",
  },
  lastMessage: {
    color: "app.text",
    fontSize: "sm",
    fontWeight: "normal",
    noOfLines: 1,
  },
  unreadBadge: {
    minW: "24px",
    h: "24px",
    align: "center",
    justify: "center",
    borderRadius: "999px",
    bg: "app.bgAux",
    color: "app.text",
    fontSize: "xs",
    fontWeight: "black",
  },
} as const;

export function ChatMatchList({ matches, onMatchClick }: ChatMatchListProps) {
  return (
    <Box {...styles.list}>
      {matches.map((match) => (
        <Button
          key={match.id}
          type="button"
          onClick={() => onMatchClick(match.id)}
          {...styles.matchButton}
        >
          <Flex align="center" gap="12px" w="100%">
            <Image src={match.photo} alt={match.name} {...styles.photo} />
            <Flex {...styles.matchContent}>
              <Text {...styles.matchName}>{match.name}</Text>
              <Text {...styles.matchMeta}>
                {match.age} · {match.location}
              </Text>
              <Text {...styles.lastMessage}>
                {match.lastMessage ?? "Začni konverzáciu."}
              </Text>
            </Flex>
            {match.unreadCount > 0 && (
              <Flex {...styles.unreadBadge}>{match.unreadCount}</Flex>
            )}
          </Flex>
        </Button>
      ))}
    </Box>
  );
}
