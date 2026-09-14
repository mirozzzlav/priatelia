import type { BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { AppHeader } from "src/components/AppHeader";
import { BackButton } from "src/components/formElements";

type PageHeaderProps = Omit<BoxProps, "title"> & {
  backLabel?: ReactNode;
  leadingContent?: ReactNode;
  intro?: ReactNode;
  onBack?: () => void;
  rightAction?: ReactNode;
  title?: ReactNode;
};

const styles = {
  backButton: {
    alignSelf: "start",
    justifySelf: "end",
    h: "34px",
    minW: "0",
    px: "10px",
    fontSize: "xs",
    iconSpacing: "5px",
  },
} as const;

export function PageHeader({
  backLabel,
  leadingContent,
  intro,
  onBack,
  rightAction,
  title,
  ...props
}: PageHeaderProps) {
  const actionNode =
    rightAction ??
    (onBack ? (
      <BackButton onClick={onBack} {...styles.backButton}>
        {backLabel}
      </BackButton>
    ) : null);

  return (
    <AppHeader
      intro={intro}
      title={title}
      action={
        actionNode
          ? {
              node: actionNode,
            }
          : undefined
      }
      {...props}
    >
      {leadingContent}
    </AppHeader>
  );
}
