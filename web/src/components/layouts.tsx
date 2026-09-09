import { Box, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { AppHeader } from "src/components/AppHeader";

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
} as const;

export function ScreenLayout({
  children,
  intro,
  title,
  ...rootProps
}: ScreenLayoutProps) {
  return (
    <Box {...screenLayoutStyles.root} {...rootProps}>
      <AppHeader intro={intro} surface="plain" title={title} />
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
