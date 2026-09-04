import { Box, Text, type BoxProps } from "@chakra-ui/react";
import { isValidElement, type ReactNode } from "react";

import { PanelHeading } from "src/components/PanelHeading";

type ScreenLayoutProps = Omit<BoxProps, "title"> & {
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
        {isValidElement(title) ? (
          title
        ) : (
          <PanelHeading as="h1" variant="main">
            {title}
          </PanelHeading>
        )}
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
