import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import locationPinIcon from "assets/location-pin.svg";
import matchIcon from "assets/match.svg";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import type { PersonPreview } from "src/features/person-preview/types";
import { getSlovakCountWord } from "src/utils/formatSlovakCount";

const styles = {
  root: (isMatched: boolean) =>
    ({
      position: "relative",
      mx: { base: "-12px", sm: "-16px" },
      px: { base: "26px", sm: "30px" },
      py: "17px",
      color: "app.text",
      borderBottom: "1px solid",
      borderColor: isMatched
        ? "rgba(159, 63, 74, 0.28)"
        : "rgba(53, 87, 45, 0.08)",
      bg: "app.white",
      bgGradient: isMatched
        ? "linear(to-b, rgba(159, 63, 74, 0.16), rgba(255, 255, 255, 1) 64%)"
        : "linear(to-b, rgba(241, 243, 246, 0.95), rgba(255, 255, 255, 1) 58%)",
    }) as const,
  identityRow: {
    minW: 0,
    w: "100%",
  },
  identityStack: {
    flex: "1 1 auto",
    minW: 0,
  },
  identityGroup: {
    align: "center",
    columnGap: { base: "9px", sm: "11px" },
    minW: 0,
    maxW: "100%",
    rowGap: "9px",
  },
  name: (size: PersonPreviewIdentitySize) =>
    ({
      m: 0,
      minW: 0,
      overflow: "hidden",
      color: "app.text",
      fontSize: size === "compact" ? "md" : { base: "2xl", sm: "3xl" },
      lineHeight: 1.05,
      letterSpacing: 0,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontWeight: "black",
    }) as const,
  age: (size: PersonPreviewIdentitySize) =>
    ({
      flexShrink: 0,
      fontSize: size === "compact" ? "sm" : { base: "2xl", sm: "3xl" },
      fontWeight: "bold",
      color: "app.text",
      lineHeight: 1.05,
    }) as const,
  identityDivider: (size: PersonPreviewIdentitySize) =>
    ({
      flexShrink: 0,
      alignSelf: "center",
      w: "1px",
      h: size === "compact" ? "16px" : { base: "22px", sm: "26px" },
      bg: "rgba(53, 87, 45, 0.22)",
    }) as const,
  metaRow: {
    mt: { base: "9px", sm: "11px" },
    minW: 0,
  },
  messageButton: {
    flex: "0 0 auto",
    h: "38px",
    minW: "150px",
    px: "16px",
    borderRadius: "999px",
    bg: "app.base",
    color: "app.white",
    fontSize: "xs",
    fontWeight: "black",
    _hover: { bg: "app.baseDark" },
    _active: { bg: "app.baseDark" },
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
    },
  },
  matchActions: {
    align: "center",
    gap: "10px",
    mt: "12px",
    w: "100%",
    wrap: "wrap",
  },
  matchTag: {
    flex: { base: "1 1 100%", sm: "0 0 auto" },
    justify: "center",
    minH: "36px",
    bg: "rgba(159, 63, 74, 0.1)",
    borderColor: "rgba(159, 63, 74, 0.22)",
    boxShadow: "0 6px 14px rgba(159, 63, 74, 0.08)",
    sx: {
      "& > img": {
        animation: "matchHeartPulse 1.35s ease-in-out infinite",
        filter: "brightness(0) saturate(100%) invert(30%) sepia(25%) saturate(1265%) hue-rotate(303deg) brightness(93%) contrast(90%)",
        transformOrigin: "50% 55%",
      },
      "@keyframes matchHeartPulse": {
        "0%, 100%": {
          transform: "scale(1)",
        },
        "18%": {
          transform: "scale(1.22)",
        },
        "34%": {
          transform: "scale(0.98)",
        },
        "48%": {
          transform: "scale(1.12)",
        },
      },
    },
  },
} as const;

type PersonPreviewIdentitySize = "compact" | "default";

type PersonPreviewIdentityProps = {
  age: string;
  name: string;
  nameClassName?: string;
  onNameClick?: () => void;
  size?: PersonPreviewIdentitySize;
};

type PersonPreviewToolbarProps = {
  isMatched?: boolean;
  onMessageClick?: () => void;
  person: PersonPreview;
};

function getAgeText(age: string) {
  const ageValue = Number.parseInt(age, 10);
  return Number.isNaN(ageValue)
    ? age
    : `${ageValue} ${getSlovakCountWord("rok", ageValue)}`;
}

export function PersonPreviewIdentity({
  age,
  name,
  nameClassName,
  onNameClick,
  size = "default",
}: PersonPreviewIdentityProps) {
  const ageText = getAgeText(age);
  const nameElement = (
    <Heading as="h1" className={nameClassName} {...styles.name(size)}>
      {name}
    </Heading>
  );

  return (
    <Flex {...styles.identityGroup}>
      {onNameClick ? (
        <Button
          onClick={onNameClick}
          type="button"
          variant="unstyled"
          h="auto"
          minW={0}
          p={0}
          textAlign="left"
          _hover={{
            color: "app.baseDark",
            textDecoration: "underline",
          }}
          _focusVisible={{
            boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
          }}
        >
          {nameElement}
        </Button>
      ) : (
        nameElement
      )}
      <Box aria-hidden="true" {...styles.identityDivider(size)} />
      <Text {...styles.age(size)}>{ageText}</Text>
    </Flex>
  );
}

export function PersonPreviewToolbar({
  isMatched = false,
  onMessageClick,
  person,
}: PersonPreviewToolbarProps) {
  const city = person.meta[0];

  return (
    <Box {...styles.root(isMatched)}>
      <Flex {...styles.identityRow}>
        <Box {...styles.identityStack}>
          <PersonPreviewIdentity age={person.age} name={person.name} />
          {city && (
            <Box {...styles.metaRow}>
              <ProfileMetaTag
                bg="rgba(79, 131, 68, 0.08)"
                borderColor="rgba(79, 131, 68, 0.16)"
                icon={locationPinIcon}
                iconFilter="invert(53%) sepia(28%) saturate(833%) hue-rotate(62deg) brightness(90%) contrast(87%)"
                type="default"
              >
                {city}
              </ProfileMetaTag>
            </Box>
          )}
        </Box>
      </Flex>
      {onMessageClick && (
        <Flex {...styles.matchActions}>
          <Button
            onClick={onMessageClick}
            type="button"
            {...styles.messageButton}
          >
            Napísať správu
          </Button>
          {isMatched && (
            <ProfileMetaTag
              icon={matchIcon}
              type="default"
              {...styles.matchTag}
            >
              Prepojili ste sa
            </ProfileMetaTag>
          )}
        </Flex>
      )}
    </Box>
  );
}
