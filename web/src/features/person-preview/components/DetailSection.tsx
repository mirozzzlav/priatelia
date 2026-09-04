import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

import { PanelHeading } from "src/components/PanelHeading";

const styles = {
  root: {
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "26px", sm: "30px" },
    py: "17px",
    borderTop: "1px solid",
    borderColor: "rgba(38, 57, 111, 0.14)",
    bgGradient:
      "linear(to-b, rgba(241, 243, 246, 0.55), rgba(255, 255, 255, 0) 58%)",
  },
} as const;

type DetailSectionProps = {
  children: ReactNode;
  title: string;
};

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Box {...styles.root}>
      <PanelHeading>{title}</PanelHeading>
      {children}
    </Box>
  );
}
