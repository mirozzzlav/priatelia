import { Box, type BoxProps } from "@chakra-ui/react";
import { forwardRef, type ReactNode } from "react";

type SurfaceBandShadow = "default" | "expanded" | "above";

type SurfaceBandProps = BoxProps & {
  children: ReactNode;
  isExpanded?: boolean;
  noValidate?: boolean;
  surfaceShadow?: SurfaceBandShadow;
};

const shadows: Record<SurfaceBandShadow, string> = {
  above: "0 -12px 28px rgba(53, 87, 45, 0.12)",
  default: "0 18px 42px rgba(53, 87, 45, 0.12)",
  expanded: "0 18px 42px rgba(53, 87, 45, 0.18)",
};

const styles = {
  root: (
    isExpanded: boolean,
    shadow: SurfaceBandShadow,
  ) =>
    ({
      w: isExpanded
        ? undefined
        : { base: "calc(100% + 24px)", sm: "calc(100% + 32px)" },
      mx: isExpanded ? undefined : { base: "-12px", sm: "-16px" },
      px: { base: "12px", sm: "16px" },
      py: "14px",
      bg: "linear-gradient(180deg, #ffffff 0%, #fbfcff 100%)",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "app.borderColor",
      boxShadow: shadows[shadow],
      color: "app.text",
    }) as const,
} as const;

export const SurfaceBand = forwardRef<HTMLDivElement, SurfaceBandProps>(
  function SurfaceBand(
    {
      children,
      isExpanded = false,
      surfaceShadow = isExpanded ? "expanded" : "default",
      ...props
    },
    ref,
  ) {
    return (
      <Box ref={ref} {...styles.root(isExpanded, surfaceShadow)} {...props}>
        {children}
      </Box>
    );
  },
);
