import type { ReactNode } from "react";
import { Box, Heading } from "@chakra-ui/react";

const styles = {
  root: {
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "26px", sm: "30px" },
    py: "17px",
    borderTop: "1px solid",
    borderColor: "rgba(101, 74, 38, 0.18)",
    bgGradient:
      "linear(to-b, rgba(255, 245, 232, 0.48), rgba(255, 255, 255, 0) 100%)",
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
    _before: {
      w: "20px",
      h: "2px",
      borderRadius: "999px",
      bg: "app.info",
      content: '""',
      flexShrink: 0,
      opacity: 0.76,
    },
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
