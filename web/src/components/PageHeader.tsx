import type { BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { AppHeader } from "src/components/AppHeader";

type PageHeaderProps = Omit<BoxProps, "title"> & {
  leadingContent?: ReactNode;
  intro?: ReactNode;
  rightAction?: ReactNode;
  title?: ReactNode;
};

export function PageHeader({
  leadingContent,
  intro,
  rightAction,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <AppHeader
      intro={intro}
      title={title}
      action={
        rightAction
          ? {
              ariaLabel: "",
              node: rightAction,
            }
          : undefined
      }
      {...props}
    >
      {leadingContent}
    </AppHeader>
  );
}
