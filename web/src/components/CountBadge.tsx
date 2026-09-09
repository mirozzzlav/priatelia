import { Flex, type FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type CountBadgeProps = Omit<FlexProps, "children"> & {
  children: ReactNode;
};

const styles = {
  root: {
    alignItems: "center",
    justifyContent: "center",
    minW: "24px",
    h: "24px",
    px: "4px",
    borderRadius: "999px",
    bg: "app.base",
    color: "app.white",
    fontSize: "xs",
    fontWeight: "black",
    lineHeight: 1,
  },
} as const;

export function CountBadge({ children, ...props }: CountBadgeProps) {
  return (
    <Flex as="span" {...styles.root} {...props}>
      {children}
    </Flex>
  );
}
