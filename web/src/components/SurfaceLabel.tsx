import { Box, Flex, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type SurfaceLabelProps = {
  icon?: ReactNode;
  onClick?: BoxProps["onClick"];
  rightIcon?: ReactNode;
  title: string;
} & Pick<BoxProps, "aria-expanded" | "aria-label">;

const styles = {
  root: {
    align: "center",
    gap: "7px",
    color: "app.baseDark",
    fontSize: { base: "xs", sm: "sm" },
    fontWeight: "black",
    lineHeight: 1,
    px: "4px",
    textTransform: "uppercase",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    h: "22px",
    minW: 0,
    p: 0,
    border: 0,
    borderRadius: "6px",
    bg: "transparent",
    color: "inherit",
    font: "inherit",
    textTransform: "inherit",
    _hover: {
      color: "app.base",
    },
    _active: {
      color: "app.base",
    },
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.18)",
      outline: "none",
    },
  },
} as const;

export function SurfaceLabel({
  icon,
  onClick,
  rightIcon,
  title,
  ...buttonProps
}: SurfaceLabelProps) {
  const content = (
    <>
      {icon}
      <Text as="span">{title}</Text>
      {rightIcon}
    </>
  );

  if (!onClick) {
    return <Flex {...styles.root}>{content}</Flex>;
  }

  return (
    <Flex {...styles.root}>
      <Box
        as="button"
        type="button"
        onClick={onClick}
        {...buttonProps}
        {...styles.button}
      >
        {content}
      </Box>
    </Flex>
  );
}
