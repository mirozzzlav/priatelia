import { Box, type BoxProps } from "@chakra-ui/react";
import { forwardRef, type ReactNode } from "react";

type HeaderSurfaceShadow = "default" | "expanded";

type HeaderSurfaceProps = BoxProps & {
  children: ReactNode;
  isExpanded?: boolean;
  noValidate?: boolean;
  surfaceShadow?: HeaderSurfaceShadow;
};

const shadows: Record<HeaderSurfaceShadow, string> = {
  default: "0 18px 42px rgba(53, 87, 45, 0.12)",
  expanded: "0 18px 42px rgba(53, 87, 45, 0.18)",
};

const styles = {
  root: (
    isExpanded: boolean,
    shadow: HeaderSurfaceShadow,
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
      borderColor: "rgba(53, 87, 45, 0.14)",
      boxShadow: shadows[shadow],
      color: "app.text",
    }) as const,
} as const;

export const HeaderSurface = forwardRef<HTMLDivElement, HeaderSurfaceProps>(
  function HeaderSurface(
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
