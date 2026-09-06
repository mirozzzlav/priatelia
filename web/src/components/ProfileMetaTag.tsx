import { Box, Button, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import interestIcon from "assets/interest.svg";
import locationPinIcon from "assets/location-pin.svg";
import { SvgImage } from "src/components/SvgImage";

type ProfileMetaTagType = "city" | "interest";

const tagIconByType: Record<ProfileMetaTagType, string> = {
  city: locationPinIcon,
  interest: interestIcon,
};

const styles = {
  tag: {
    align: "center",
    columnGap: "5px",
    minW: 0,
    w: "fit-content",
    maxW: "100%",
    px: "8px",
    py: "5px",
    border: "1px solid",
    borderColor: "rgba(38, 57, 111, 0.08)",
    borderRadius: "999px",
    bg: "rgba(38, 57, 111, 0.035)",
  },
  interestTag: {
    columnGap: "6px",
    px: "9px",
    py: "6px",
    borderColor: "app.info",
    bg: "app.bgAux",
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 2px 7px rgba(38, 57, 111, 0.08)",
  },
  icon: (type: ProfileMetaTagType) =>
    ({
      flexShrink: 0,
      boxSize: type === "city" ? { base: "20px", sm: "22px" } : "17px",
      filter:
        type === "city"
          ? "invert(34%) sepia(20%) saturate(2026%) hue-rotate(184deg) brightness(92%) contrast(92%)"
          : undefined,
    }) as const,
  label: {
    minW: 0,
    overflow: "hidden",
    color: "app.text",
    fontSize: { base: "sm", sm: "md" },
    fontWeight: "bold",
    lineHeight: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  removeButton: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    boxSize: "18px",
    minW: "18px",
    ml: "2px",
    borderRadius: "999px",
    bg: "app.white",
    color: "app.text",
    transition: "background 140ms ease, color 140ms ease",
    _active: {
      bg: "app.text",
      color: "app.white",
    },
    _hover: {
      bg: "app.text",
      color: "app.white",
    },
  },
  removeIcon: {
    position: "relative",
    boxSize: "9px",
    _before: {
      content: '""',
      position: "absolute",
      top: "50%",
      left: 0,
      w: "100%",
      h: "2px",
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
      h: "2px",
      borderRadius: "999px",
      bg: "currentColor",
      transform: "translateY(-50%) rotate(-45deg)",
    },
  },
} as const;

type ProfileMetaTagProps = {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  type: ProfileMetaTagType;
};

export function ProfileMetaTag({
  children,
  onRemove,
  removeLabel,
  type,
}: ProfileMetaTagProps) {
  return (
    <Flex {...styles.tag} {...(type === "interest" ? styles.interestTag : {})}>
      <SvgImage src={tagIconByType[type]} {...styles.icon(type)} />
      <Text
        as="span"
        {...styles.label}
      >
        {children}
      </Text>
      {onRemove && (
        <Button
          aria-label={removeLabel}
          onClick={onRemove}
          type="button"
          variant="unstyled"
          {...styles.removeButton}
        >
          <Box aria-hidden="true" {...styles.removeIcon} />
        </Button>
      )}
    </Flex>
  );
}
