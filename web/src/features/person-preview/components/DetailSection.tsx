import type { ReactNode } from "react";
import { Box, Heading } from "@chakra-ui/react";

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
  heading: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    mb: "16px",
    color: "app.text",
    fontSize: "xl",
    fontWeight: "semibold",
    lineHeight: 1.2,
    letterSpacing: 0,
    borderBottom: "2px solid",
    borderColor: "app.info",
    width: "max-content",
    padding: "0 8px 4px 0",
  },
} as const;

type DetailSectionProps = {
  children: ReactNode;
  title: string;
};

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Box {...styles.root}>
      <Heading as="h2" {...styles.heading}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}
