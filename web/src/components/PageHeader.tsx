import { Box, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { HeaderSurface } from "src/components/HeaderSurface";
import { PanelHeading } from "src/components/PanelHeading";

type PageHeaderProps = BoxProps & {
  leadingContent?: ReactNode;
  intro?: ReactNode;
  rightAction?: ReactNode;
  title?: ReactNode;
};

const styles = {
  root: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "start",
    gap: "12px",
  },
  titleWrap: {
    minW: 0,
  },
  intro: {
    mt: "6px",
    color: "app.text",
    fontSize: "sm",
    lineHeight: 1.35,
  },
  rightAction: {
    alignSelf: "start",
    justifySelf: "end",
  },
} as const;

export function PageHeader({
  leadingContent,
  intro,
  rightAction,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <HeaderSurface {...styles.root} {...props}>
      {leadingContent ?? (
        <Box {...styles.titleWrap}>
          <PanelHeading as="h1" variant="main">
            {title}
          </PanelHeading>
          {intro && <Text {...styles.intro}>{intro}</Text>}
        </Box>
      )}
      {rightAction && <Box {...styles.rightAction}>{rightAction}</Box>}
    </HeaderSurface>
  );
}
