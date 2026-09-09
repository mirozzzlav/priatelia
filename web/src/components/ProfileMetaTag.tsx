import { Box, Button, Flex, Text, type FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { SvgImage } from "src/components/SvgImage";

type ProfileMetaTagType = "default" | "special";
type ProfileMetaTagSize = "compact" | "sm" | "md";

const styles = {
  tag: (size: ProfileMetaTagSize) =>
    ({
      align: "center",
      columnGap: size === "sm" ? "4px" : "5px",
      minW: 0,
      w: "fit-content",
      maxW: "100%",
      px: size === "compact" ? "6px" : size === "sm" ? "7px" : "8px",
      py: size === "compact" ? "3px" : size === "sm" ? "4px" : "5px",
      border: "1px solid",
      borderColor: "rgba(53, 87, 45, 0.08)",
      borderRadius: "999px",
      bg: "rgba(53, 87, 45, 0.035)",
    }) as const,
  specialTag: (size: ProfileMetaTagSize) =>
    ({
      columnGap: size === "sm" ? "5px" : "6px",
      px: size === "compact" ? "7px" : size === "sm" ? "8px" : "9px",
      py: size === "compact" ? "4px" : size === "sm" ? "5px" : "6px",
      borderColor: "app.info",
      bg: "app.bgAux",
      boxShadow:
        "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 2px 7px rgba(53, 87, 45, 0.08)",
    }) as const,
  icon: (
    type: ProfileMetaTagType,
    size: ProfileMetaTagSize,
    iconFilter?: string,
  ) =>
    ({
      flexShrink: 0,
      boxSize:
        size === "compact"
          ? type === "default"
            ? "13px"
            : "12px"
          : size === "sm"
            ? type === "default"
              ? "16px"
              : "15px"
            : type === "default"
              ? { base: "20px", sm: "22px" }
              : "17px",
      filter: iconFilter,
    }) as const,
  label: (size: ProfileMetaTagSize) =>
    ({
      minW: 0,
      overflow: "hidden",
      color: "app.text",
      fontSize:
        size === "compact"
          ? "11px"
          : size === "sm"
            ? "xs"
            : { base: "sm", sm: "md" },
      fontWeight: "bold",
      lineHeight: 1,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }) as const,
  removeButton: (size: ProfileMetaTagSize) =>
    ({
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      boxSize: size === "compact" ? "14px" : size === "sm" ? "16px" : "18px",
      minW: size === "compact" ? "14px" : size === "sm" ? "16px" : "18px",
      ml: size === "compact" ? 0 : size === "sm" ? "1px" : "2px",
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
    }) as const,
  removeIcon: (size: ProfileMetaTagSize) =>
    ({
      position: "relative",
      boxSize: size === "compact" ? "7px" : size === "sm" ? "8px" : "9px",
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
    }) as const,
} as const;

type ProfileMetaTagProps = Omit<FlexProps, "children" | "onClick"> & {
  children: ReactNode;
  icon: string;
  iconFilter?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  size?: ProfileMetaTagSize;
  type: ProfileMetaTagType;
};

export function ProfileMetaTag({
  children,
  icon,
  iconFilter,
  isDisabled = false,
  isSelected = false,
  onClick,
  onRemove,
  removeLabel,
  size = "md",
  type,
  ...props
}: ProfileMetaTagProps) {
  const isClickable = Boolean(onClick);

  return (
    <Flex
      as={isClickable ? "button" : undefined}
      cursor={isClickable ? "pointer" : undefined}
      disabled={isClickable ? isDisabled : undefined}
      onClick={onClick}
      type={isClickable ? "button" : undefined}
      {...styles.tag(size)}
      {...(type === "special" ? styles.specialTag(size) : {})}
      {...(isSelected
        ? {
            bg: "app.base",
            borderColor: "app.base",
            color: "app.white",
            boxShadow: "0 4px 11px rgba(53, 87, 45, 0.16)",
          }
        : {})}
      {...props}
    >
      <SvgImage
        src={icon}
        {...styles.icon(
          type,
          size,
          isSelected ? "brightness(0) invert(1)" : iconFilter,
        )}
      />
      <Text
        as="span"
        {...styles.label(size)}
        {...(isSelected ? { color: "app.white" } : {})}
      >
        {children}
      </Text>
      {onRemove && (
        <Button
          aria-label={removeLabel}
          onClick={onRemove}
          type="button"
          variant="unstyled"
          {...styles.removeButton(size)}
        >
          <Box aria-hidden="true" {...styles.removeIcon(size)} />
        </Button>
      )}
    </Flex>
  );
}
