import { Box, Heading, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type ScreenLayoutProps = BoxProps & {
  children: ReactNode;
  intro?: ReactNode;
  title: ReactNode;
};

const screenLayoutStyles = {
  root: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "34px",
  },
  header: {
    pt: "22px",
    pb: "18px",
  },
  title: {
    color: "app.text",
    fontSize: { base: "3xl", sm: "4xl" },
    lineHeight: 1.05,
    letterSpacing: 0,
  },
  intro: {
    mt: "8px",
    color: "app.text",
    fontSize: "sm",
    lineHeight: 1.45,
  },
} as const;

export function ScreenLayout({
  children,
  intro,
  title,
  ...rootProps
}: ScreenLayoutProps) {
  return (
    <Box {...screenLayoutStyles.root} {...rootProps}>
      <Box {...screenLayoutStyles.header}>
        <Heading as="h1" {...screenLayoutStyles.title}>
          {title}
        </Heading>
        {intro && <Text {...screenLayoutStyles.intro}>{intro}</Text>}
      </Box>
      {children}
    </Box>
  );
}

type CenteredStatusLayoutProps = BoxProps & {
  children: ReactNode;
};

const centeredStatusLayoutStyles = {
  root: {
    minH: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    px: { base: "18px", sm: "24px" },
    py: "34px",
  },
} as const;

export function CenteredStatusLayout({
  children,
  ...rootProps
}: CenteredStatusLayoutProps) {
  return (
    <Box {...centeredStatusLayoutStyles.root} {...rootProps}>
      {children}
    </Box>
  );
}
