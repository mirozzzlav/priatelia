import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

import { PanelHeading } from "src/components/PanelHeading";

const styles = {
  root: {
    mx: {
      base: "var(--pill-section-bleed-base, -12px)",
      sm: "var(--pill-section-bleed-sm, -16px)",
    },
    px: { base: "26px", sm: "30px" },
    py: "17px",
    borderBottom: "1px solid",
    borderColor: "app.borderColor",
    bgGradient:
      "linear(to-b, rgba(241, 243, 246, 0.55), rgba(255, 255, 255, 0) 58%)",
    _last: {
      borderBottom: 0,
    },
  },
} as const;

type DetailSectionProps = {
  children: ReactNode;
  headingSpacing?: "normal" | "loose";
  title: string;
};

export function DetailSection({
  title,
  headingSpacing = "normal",
  children,
}: DetailSectionProps) {
  return (
    <Box {...styles.root}>
      {title && <PanelHeading spacing={headingSpacing}>{title}</PanelHeading>}
      {children}
    </Box>
  );
}
