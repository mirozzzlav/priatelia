import { Box, Icon, IconButton, Text, type BoxProps } from "@chakra-ui/react";
import {
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { HeaderSurface } from "src/components/HeaderSurface";
import { PanelHeading } from "src/components/PanelHeading";

type AppHeaderSurface = "plain" | "surface";
type AppHeaderActionIcon = "close" | ReactElement;

type AppHeaderAction = {
  ariaLabel: string;
  icon?: AppHeaderActionIcon;
  node?: ReactNode;
  onClick?: () => void;
};

type AppHeaderProps = Omit<BoxProps, "title"> & {
  action?: AppHeaderAction;
  children?: ReactNode;
  intro?: ReactNode;
  surface?: AppHeaderSurface;
  title?: ReactNode;
};

const styles = {
  surfaceRoot: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "start",
    gap: "12px",
  },
  plainRoot: {
    pt: "22px",
    pb: "18px",
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
  action: {
    alignSelf: "start",
    justifySelf: "end",
  },
  iconButton: {
    display: "grid",
    placeItems: "center",
    boxSize: "34px",
    minW: "34px",
    p: 0,
    border: "1px solid",
    borderColor: "app.base",
    borderRadius: "999px",
    bg: "transparent",
    color: "app.base",
    _hover: { bg: "rgba(79, 131, 68, 0.1)" },
    _active: { bg: "rgba(79, 131, 68, 0.14)" },
  },
} as const;

export function AppHeader({
  action,
  children,
  intro,
  surface = "surface",
  title,
  ...props
}: AppHeaderProps) {
  const content = children ?? (
    <Box {...styles.titleWrap}>
      {isValidElement(title) ? (
        title
      ) : (
        <PanelHeading as="h1" variant="main">
          {title}
        </PanelHeading>
      )}
      {intro && <Text {...styles.intro}>{intro}</Text>}
    </Box>
  );
  const actionNode = action ? <AppHeaderAction action={action} /> : null;

  if (surface === "plain") {
    return (
      <Box {...styles.plainRoot} {...props}>
        {content}
      </Box>
    );
  }

  return (
    <HeaderSurface {...styles.surfaceRoot} {...props}>
      {content}
      {actionNode && <Box {...styles.action}>{actionNode}</Box>}
    </HeaderSurface>
  );
}

function AppHeaderAction({ action }: { action: AppHeaderAction }) {
  if (action.node) {
    return <>{action.node}</>;
  }

  return (
    <IconButton
      aria-label={action.ariaLabel}
      icon={getActionIcon(action.icon)}
      onClick={action.onClick}
      {...styles.iconButton}
    />
  );
}

function getActionIcon(icon: AppHeaderActionIcon | undefined) {
  if (icon === "close" || !icon) {
    return <CloseIcon />;
  }

  return icon;
}

function CloseIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      boxSize="18px"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Icon>
  );
}
