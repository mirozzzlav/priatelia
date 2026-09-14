import { Box, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

const styles = {
  root: {
    mx: 0,
    mt: "12px",
    mb: "12px",
    px: { base: "8px", sm: "10px" },
    bg: "app.white",
    border: "1px solid",
    borderColor: "app.borderColor",
    borderRadius: "28px",
    boxShadow: "0 14px 34px rgba(53, 87, 45, 0.12)",
    overflow: "hidden",
    sx: {
      "--pill-section-bleed-base": "-8px",
      "--pill-section-bleed-sm": "-10px",
    },
  },
} as const;

type PillGroupProps = Omit<BoxProps, "children"> & {
  children: ReactNode;
};

export function PillGroup({
  children,
  ...rootProps
}: PillGroupProps) {
  return (
    <Box {...styles.root} {...rootProps}>
      {children}
    </Box>
  );
}
