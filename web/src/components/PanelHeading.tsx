import { Heading, type HeadingProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PanelHeadingProps = HeadingProps & {
  children: ReactNode;
  variant?: "main" | "normal";
};

const styles = {
  root: (variant: NonNullable<PanelHeadingProps["variant"]>) =>
    ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      mb: "16px",
      color: "app.text",
      fontSize:
        variant === "main"
          ? "3xl"
          : { base: "xl", sm: "2xl" },
      fontWeight: "semibold",
      lineHeight: variant === "main" ? 1.05 : 1.2,
      letterSpacing: "0.02em",
      borderBottom: "2px solid",
      borderColor: "app.info",
      width: "max-content",
      maxW: "100%",
      padding: "0 8px 4px 0",
    }) as const,
} as const;

export function PanelHeading({
  children,
  variant = "normal",
  ...props
}: PanelHeadingProps) {
  return (
    <Heading as="h2" {...styles.root(variant)} {...props}>
      {children}
    </Heading>
  );
}
