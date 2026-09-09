import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import locationPinIcon from "assets/location-pin.svg";
import { CountBadge } from "src/components/CountBadge";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import { PersonPreviewIdentity } from "src/features/person-preview";
import type { ChatMatch } from "src/services/api";

type ChatMatchListProps = {
  matches: ChatMatch[];
  onMatchClick: (matchId: string) => void;
  onProfileClick: (matchId: string) => void;
};

const styles = {
  list: {
    display: "grid",
    gap: "10px",
  },
  matchCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxW: "100%",
    minH: "76px",
    minW: 0,
    overflow: "hidden",
    p: "10px",
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.16)",
    borderRadius: "22px",
    bg: "app.white",
    boxShadow: "0 7px 18px rgba(53, 87, 45, 0.08)",
  },
  profilePhotoButton: {
    display: "block",
    flexShrink: 0,
    h: "54px",
    minW: "54px",
    p: 0,
    borderRadius: "12px",
    overflow: "hidden",
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.3)",
    },
  },
  photo: {
    boxSize: "54px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  matchContent: {
    minW: 0,
    flex: "1 1 0",
    direction: "column",
    gap: "3px",
  },
  profileInfo: {
    alignSelf: "start",
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    minW: 0,
    maxW: "100%",
    color: "app.text",
    textAlign: "left",
  },
  messageButton: {
    alignSelf: "stretch",
    display: "block",
    h: "auto",
    minW: 0,
    maxW: "100%",
    p: 0,
    overflow: "hidden",
    color: "app.text",
    textAlign: "left",
    w: "100%",
    _hover: {
      color: "app.baseDark",
      textDecoration: "underline",
    },
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
    },
  },
  locationTag: {
    flex: "1 1 0",
    minW: 0,
  },
  lastMessage: {
    color: "app.text",
    fontSize: "sm",
    fontWeight: "normal",
    maxW: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  unreadBadge: {
    flexShrink: 0,
    cursor: "pointer",
    borderRadius: "999px",
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
    },
  },
} as const;

export function ChatMatchList({
  matches,
  onMatchClick,
  onProfileClick,
}: ChatMatchListProps) {
  return (
    <Box {...styles.list}>
      {matches.map((match) => (
        <Flex key={match.id} {...styles.matchCard}>
          <Button
            aria-label={`Otvoriť profil: ${match.name}`}
            onClick={() => onProfileClick(match.id)}
            type="button"
            variant="unstyled"
            {...styles.profilePhotoButton}
          >
            <Image src={match.photo} alt={match.name} {...styles.photo} />
          </Button>
          <Flex {...styles.matchContent}>
            <Flex {...styles.profileInfo}>
              <PersonPreviewIdentity
                age={match.age}
                name={match.name}
                onNameClick={() => onProfileClick(match.id)}
                size="compact"
              />
              <ProfileMetaTag
                icon={locationPinIcon}
                iconFilter="invert(53%) sepia(28%) saturate(833%) hue-rotate(62deg) brightness(90%) contrast(87%)"
                size="compact"
                type="default"
                {...styles.locationTag}
              >
                {match.location}
              </ProfileMetaTag>
            </Flex>
            <Button
              onClick={() => onMatchClick(match.id)}
              type="button"
              variant="unstyled"
              {...styles.messageButton}
            >
              <Text {...styles.lastMessage}>
                {match.lastMessage ?? "Začni konverzáciu."}
              </Text>
            </Button>
          </Flex>
          {match.unreadCount > 0 && (
            <Button
              aria-label={`Otvoriť konverzáciu, ${match.unreadCount} neprečítaných správ`}
              onClick={() => onMatchClick(match.id)}
              type="button"
              variant="unstyled"
              {...styles.unreadBadge}
            >
              <CountBadge>{match.unreadCount}</CountBadge>
            </Button>
          )}
        </Flex>
      ))}
    </Box>
  );
}
