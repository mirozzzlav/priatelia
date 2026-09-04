import { Heading, type HeadingProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PanelHeadingProps = HeadingProps & {
  children: ReactNode;
};

const styles = {
  root: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    mb: "16px",
    color: "app.text",
    fontSize: { base: "xl", sm: "2xl" },
    fontWeight: "semibold",
    lineHeight: 1.2,
    letterSpacing: 0,
    borderBottom: "2px solid",
    borderColor: "app.info",
    width: "max-content",
    maxW: "100%",
    padding: "0 8px 4px 0",
  },
} as const;

export function PanelHeading({ children, ...props }: PanelHeadingProps) {
  return (
    <Heading as="h2" {...styles.root} {...props}>
      {children}
    </Heading>
  );
}
