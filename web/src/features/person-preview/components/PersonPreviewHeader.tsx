import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  type BoxProps,
} from "@chakra-ui/react";

import locationPinIcon from "assets/location-pin.svg";
import thumbDownIcon from "assets/thumb-down.svg";
import thumbUpIcon from "assets/thumb-up.svg";
import { LoadingPill } from "src/components/LoadingPill";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";
import { SvgImage } from "src/components/SvgImage";
import type {
  ActivePersonPreviewAction,
  PersonPreview,
} from "src/features/person-preview/types";
import { getSlovakCountWord } from "src/utils/formatSlovakCount";

const styles = {
  stage: (
    isSticky: boolean,
    stickyTop: BoxProps["top"],
    surface: PersonPreviewHeaderSurface,
  ) =>
    ({
      position: isSticky ? "sticky" : "relative",
      top: isSticky ? stickyTop : undefined,
      zIndex: 30,
      ...(surface === "raised"
        ? {
            mx: { base: "2px", sm: "8px" },
            mt: "12px",
            bg: "app.white",
            border: "1px solid",
            borderColor: "app.borderColorStrong",
            borderRadius: "28px",
            boxShadow: "0 18px 42px rgba(53, 87, 45, 0.18)",
            overflow: "hidden",
            sx: {
              "--pill-section-bleed-base": "0px",
              "--pill-section-bleed-sm": "0px",
              touchAction: "pan-y",
            },
          }
        : {
            sx: {
              touchAction: "pan-y",
            },
          }),
    }) as const,
  identityBlock: {
    position: "relative",
    userSelect: "none",
  },
  content: (hasHeader: boolean) =>
    ({
      position: "relative",
      mx: {
        base: "var(--pill-section-bleed-base, -12px)",
        sm: "var(--pill-section-bleed-sm, -16px)",
      },
      px: { base: "26px", sm: "30px" },
      py: "17px",
      color: "app.text",
      borderBottom: "1px solid",
      borderColor: "app.borderColor",
      bg: "app.white",
      bgGradient: hasHeader
        ? undefined
        : "linear(to-b, rgba(241, 243, 246, 0.95), rgba(255, 255, 255, 1) 58%)",
    }) as const,
  offerHeader: {
    align: "center",
    gap: "11px",
    mb: "13px",
    pb: "13px",
    borderBottom: "1px solid",
    borderColor: "app.borderColorStrong",
    bg: "app.white",
  },
  offerIcon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    boxSize: "44px",
    border: "1px solid",
    borderColor: "app.borderColorStrong",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.66)",
  },
  offerIconImage: {
    boxSize: "30px",
    filter:
      "invert(53%) sepia(28%) saturate(833%) hue-rotate(62deg) brightness(90%) contrast(87%)",
  },
  offerCopy: {
    minW: 0,
  },
  offerHeadline: {
    color: "app.baseDark",
    fontSize: { base: "md", sm: "lg" },
    fontWeight: "black",
    lineHeight: 1.1,
    textTransform: "uppercase",
  },
  offerDescription: {
    mt: "3px",
    color: "app.text",
    fontSize: { base: "xs", sm: "sm" },
    fontWeight: "bold",
    lineHeight: 1.3,
    opacity: 0.68,
  },
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
  transitionOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    align: "center",
    justify: "center",
    pointerEvents: "none",
  },
} as const;

type PersonPreviewHeaderSurface = "plain" | "raised";
type PersonPreviewIdentitySize = "compact" | "default";

type PersonPreviewIdentityProps = {
  age: string;
  name: string;
  nameClassName?: string;
  onNameClick?: () => void;
  size?: PersonPreviewIdentitySize;
};

type PersonPreviewHeaderProps = {
  activeAction: ActivePersonPreviewAction;
  headerDescription?: string;
  headerIcon?: string;
  headerTitle?: string;
  isSticky?: boolean;
  isLoadingNextPerson: boolean;
  person: PersonPreview;
  stickyTop?: BoxProps["top"];
  surface?: PersonPreviewHeaderSurface;
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

export function PersonPreviewHeader({
  activeAction,
  headerDescription,
  headerIcon,
  headerTitle,
  isSticky = true,
  isLoadingNextPerson,
  person,
  stickyTop = "176px",
  surface = "plain",
}: PersonPreviewHeaderProps) {
  const actionIcon = activeAction === "like" ? thumbUpIcon : thumbDownIcon;
  const city = person.meta[0];
  const hasHeader = Boolean(headerTitle || headerDescription || headerIcon);

  return (
    <Box {...styles.stage(isSticky, stickyTop, surface)}>
      <Box as="article" {...styles.identityBlock}>
        <Box {...styles.content(hasHeader)}>
          {hasHeader && (
            <Flex {...styles.offerHeader}>
              {headerIcon && (
                <Box aria-hidden="true" {...styles.offerIcon}>
                  <SvgImage src={headerIcon} {...styles.offerIconImage} />
                </Box>
              )}
              <Box {...styles.offerCopy}>
                {headerTitle && (
                  <Text {...styles.offerHeadline}>{headerTitle}</Text>
                )}
                {headerDescription && (
                  <Text {...styles.offerDescription}>{headerDescription}</Text>
                )}
              </Box>
            </Flex>
          )}
          <Flex {...styles.identityRow}>
            <Box {...styles.identityStack}>
              <PersonPreviewIdentity age={person.age} name={person.name} />
              {city && (
                <Box {...styles.metaRow}>
                  <ProfileMetaTag
                    bg="rgba(79, 131, 68, 0.08)"
                    borderColor="app.borderColor"
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
        </Box>
      </Box>
      {isLoadingNextPerson && (
        <Flex {...styles.transitionOverlay}>
          <LoadingPill icon={actionIcon} text="Hľadám ti ďalšieho priateľa." />
        </Flex>
      )}
    </Box>
  );
}
