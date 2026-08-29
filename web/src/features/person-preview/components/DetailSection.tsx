import type { ReactNode } from "react";
import { Box, Heading } from "@chakra-ui/react";

const styles = {
  root: {
    mt: "28px",
    px: "4px",
    py: "20px",
    borderTop: "1px solid",
    borderColor: "app.white",
  },
  heading: {
    mb: "22px",
    color: "app.text",
    fontSize: "xl",
    lineHeight: 1.2,
    letterSpacing: 0,
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
