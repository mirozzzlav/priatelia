import { type ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { EnvelopeIcon } from "src/components/EnvelopeIcon";
import { SecondaryButton } from "src/components/formElements";

type MessageButtonSize = "compact" | "normal";

type MessageButtonProps = ButtonProps & {
  children?: ReactNode;
  sizeVariant?: MessageButtonSize;
};

const styles = {
  button: (size: MessageButtonSize) =>
    ({
      w: "100%",
      h: size === "compact" ? "38px" : "48px",
      gap: size === "compact" ? "7px" : "8px",
      px: size === "compact" ? "12px" : "18px",
      fontSize: size === "compact" ? "xs" : "sm",
    }) as const,
  icon: (size: MessageButtonSize) =>
    ({
      boxSize: size === "compact" ? "15px" : "17px",
      flexShrink: 0,
    }) as const,
} as const;

export function MessageButton({
  children = "Napíš mi",
  sizeVariant = "normal",
  ...props
}: MessageButtonProps) {
  return (
    <SecondaryButton {...styles.button(sizeVariant)} {...props}>
      <EnvelopeIcon {...styles.icon(sizeVariant)} />
      {children}
    </SecondaryButton>
  );
}
