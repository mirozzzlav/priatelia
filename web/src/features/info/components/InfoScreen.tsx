import { Box, Heading, Text } from "@chakra-ui/react";

import { PrimaryButton } from "src/components/formElements";
import { CenteredStatusLayout } from "src/components/layouts";
import { StatusIcon, type StatusIconVariant } from "src/components/StatusIcon";

type InfoScreenVariant = StatusIconVariant;

type InfoScreenProps = {
  actionLabel?: string;
  message: string;
  onActionClick?: () => void;
  title: string;
  variant?: InfoScreenVariant;
};

const variantConfig = {
  error: {
    color: "app.error",
  },
  info: {
    color: "app.info",
  },
  success: {
    color: "app.success",
  },
} as const;

const styles = {
  content: {
    display: "grid",
    justifyItems: "center",
    gap: "18px",
    textAlign: "center",
  },
  iconWrap: (variant: InfoScreenVariant) =>
    ({
      boxSize: "62px",
      display: "grid",
      placeItems: "center",
      color: variantConfig[variant].color,
    }) as const,
  title: {
    color: "app.text",
    fontSize: { base: "3xl", sm: "4xl" },
    lineHeight: 1.05,
    letterSpacing: 0,
  },
  message: {
    color: "app.text",
    fontSize: "md",
    lineHeight: 1.55,
  },
  actionButton: {
    mt: "8px",
  },
} as const;

export function InfoScreen({
  actionLabel,
  message,
  onActionClick,
  title,
  variant = "info",
}: InfoScreenProps) {
  return (
    <CenteredStatusLayout>
      <Box {...styles.content}>
        <Box {...styles.iconWrap(variant)}>
          <StatusIcon variant={variant} boxSize="58px" />
        </Box>
        <Heading as="h1" {...styles.title}>
          {title}
        </Heading>
        <Text {...styles.message}>{message}</Text>
        {actionLabel && onActionClick && (
          <PrimaryButton onClick={onActionClick} {...styles.actionButton}>
            {actionLabel}
          </PrimaryButton>
        )}
      </Box>
    </CenteredStatusLayout>
  );
}
