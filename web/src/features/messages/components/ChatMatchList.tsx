import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

import locationPinIcon from "assets/location-pin.svg";
import { CountBadge } from "src/components/CountBadge";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import type { ChatMatch } from "src/services/api";
import { getSlovakCountWord } from "src/utils/formatSlovakCount";

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
    position: "relative",
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
  threadButton: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    display: "block",
    h: "100%",
    minW: 0,
    p: 0,
    borderRadius: "22px",
    cursor: "pointer",
    transition:
      "background-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease",
    _hover: {
      bg: "rgba(197, 106, 24, 0.055)",
      boxShadow:
        "inset 0 0 0 2px rgba(197, 106, 24, 0.28), 0 9px 22px rgba(53, 87, 45, 0.11)",
    },
    _active: {
      bg: "rgba(197, 106, 24, 0.09)",
      transform: "scale(0.997)",
    },
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(197, 106, 24, 0.28)",
    },
  },
  profilePhotoButton: {
    position: "relative",
    zIndex: 2,
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
  identityGroup: {
    align: "center",
    columnGap: "9px",
    minW: 0,
    maxW: "100%",
  },
  nameButton: {
    position: "relative",
    zIndex: 2,
    h: "auto",
    minW: 0,
    p: 0,
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
  name: {
    m: 0,
    minW: 0,
    overflow: "hidden",
    color: "app.text",
    fontSize: "md",
    lineHeight: 1.05,
    letterSpacing: 0,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "black",
  },
  age: {
    flexShrink: 0,
    fontSize: "sm",
    fontWeight: "bold",
    color: "app.text",
    lineHeight: 1.05,
  },
  identityDivider: {
    flexShrink: 0,
    alignSelf: "center",
    w: "1px",
    h: "16px",
    bg: "rgba(53, 87, 45, 0.22)",
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
    position: "relative",
    zIndex: 2,
    flexShrink: 0,
    cursor: "pointer",
    borderRadius: "999px",
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
    },
  },
} as const;

function getAgeText(age: string) {
  const ageValue = Number.parseInt(age, 10);
  return Number.isNaN(ageValue)
    ? age
    : `${ageValue} ${getSlovakCountWord("rok", ageValue)}`;
}

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
            aria-label={`Otvoriť konverzáciu s: ${match.name}`}
            onClick={() => onMatchClick(match.id)}
            type="button"
            variant="unstyled"
            {...styles.threadButton}
          />
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
              <Flex {...styles.identityGroup}>
                <Button
                  onClick={() => onProfileClick(match.id)}
                  type="button"
                  variant="unstyled"
                  {...styles.nameButton}
                >
                  <Text as="span" {...styles.name}>
                    {match.name}
                  </Text>
                </Button>
                <Box aria-hidden="true" {...styles.identityDivider} />
                <Text {...styles.age}>{getAgeText(match.age)}</Text>
              </Flex>
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
            <Text {...styles.lastMessage}>
              {match.lastMessage ?? "Začni konverzáciu."}
            </Text>
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
