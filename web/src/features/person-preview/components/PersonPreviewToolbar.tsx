import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

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
    borderBottom: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.08)",
    bg: "app.white",
    bgGradient:
      "linear(to-b, rgba(241, 243, 246, 0.95), rgba(255, 255, 255, 1) 58%)",
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
    mt: "12px",
    h: "38px",
    px: "10px",
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
  onMessageClick,
  person,
}: PersonPreviewToolbarProps) {
  const city = person.meta[0];

  return (
    <Box {...styles.root}>
      <Flex {...styles.identityRow}>
        <PersonPreviewIdentity age={person.age} name={person.name} />
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
      {onMessageClick && (
        <Button
          onClick={onMessageClick}
          type="button"
          {...styles.messageButton}
        >
          Napísať správu
        </Button>
      )}
    </Box>
  );
}
