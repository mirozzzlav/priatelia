import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import {
  StatusIcon,
  type StatusIconVariant,
} from "src/components/StatusIcon";

type FormStatusMessageVariant = Exclude<StatusIconVariant, "info">;

type FormStatusMessageProps = {
  children: ReactNode;
  variant: FormStatusMessageVariant;
};

const styles = {
  root: (variant: FormStatusMessageVariant) =>
    ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      py: "12px",
      color: `app.${variant}`,
      fontSize: "sm",
      fontWeight: "extrabold",
    }) as const,
  icon: {
    flexShrink: 0,
  },
} as const;

export function FormStatusMessage({
  children,
  variant,
}: FormStatusMessageProps) {
  return (
    <Box {...styles.root(variant)}>
      <Box {...styles.icon}>
        <StatusIcon variant={variant} boxSize="22px" />
      </Box>
      <Text>{children}</Text>
    </Box>
  );
}
