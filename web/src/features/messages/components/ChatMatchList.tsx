import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import { CountBadge } from "src/components/CountBadge";
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
    borderColor: "rgba(53, 87, 45, 0.16)",
    borderRadius: "22px",
    bg: "app.white",
    boxShadow: "0 7px 18px rgba(53, 87, 45, 0.08)",
    color: "app.text",
    textAlign: "left",
    transition:
      "background 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
    _hover: {
      bg: "rgba(53, 87, 45, 0.06)",
      borderColor: "rgba(53, 87, 45, 0.26)",
      boxShadow: "0 9px 22px rgba(53, 87, 45, 0.11)",
    },
    _active: {
      bg: "rgba(53, 87, 45, 0.1)",
      borderColor: "rgba(53, 87, 45, 0.28)",
      boxShadow: "0 2px 8px rgba(53, 87, 45, 0.08)",
    },
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
    flexShrink: 0,
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
              <CountBadge {...styles.unreadBadge}>
                {match.unreadCount}
              </CountBadge>
            )}
          </Flex>
        </Button>
      ))}
    </Box>
  );
}
