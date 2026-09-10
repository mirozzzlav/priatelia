import { Box, Button, Flex, Text, type ButtonProps } from "@chakra-ui/react";

import thumbDownFilledIcon from "assets/thumb-down-filled.svg";
import thumbDownIcon from "assets/thumb-down.svg";
import thumbUpFilledIcon from "assets/thumb-up-filled.svg";
import thumbUpIcon from "assets/thumb-up.svg";
import { SvgImage } from "src/components/SvgImage";
import type {
  ActivePersonPreviewAction,
  PersonPreviewAction,
  PersonPreviewActionHandlers,
} from "src/features/person-preview/types";

const styles = {
  grid: {
    w: "100%",
    gap: "12px",
  },
  button: {
    flex: "1 1 50%",
    h: { base: "52px", sm: "54px" },
    minW: 0,
    px: { base: "14px", sm: "18px" },
    py: 0,
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.18)",
    borderRadius: "999px",
    bg: "app.white",
    color: "app.text",
    boxShadow: "0 7px 18px rgba(53, 87, 45, 0.08)",
    transition: "background 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
    _hover: {
      bg: "rgba(79, 131, 68, 0.1)",
      borderColor: "rgba(53, 87, 45, 0.26)",
      boxShadow: "0 9px 22px rgba(53, 87, 45, 0.11)",
    },
    _active: {
      bg: "rgba(79, 131, 68, 0.14)",
      borderColor: "rgba(53, 87, 45, 0.28)",
      boxShadow: "0 2px 8px rgba(53, 87, 45, 0.08)",
    },
    sx: {
      "&:hover [data-outline-icon], &:active [data-outline-icon], &[data-active='true'] [data-outline-icon]":
        {
          opacity: 0,
        },
      "&:hover [data-filled-icon], &:active [data-filled-icon], &[data-active='true'] [data-filled-icon]":
        {
          opacity: 1,
        },
    },
    _disabled: {
      opacity: 0.54,
      cursor: "not-allowed",
    },
  },
  iconWrap: {
    position: "relative",
    flexShrink: 0,
    boxSize: { base: "25px", sm: "26px" },
  },
  icon: {
    position: "absolute",
    inset: 0,
    transition: "opacity 140ms ease",
  },
  outlineIcon: {
    opacity: 1,
  },
  filledIcon: {
    opacity: 0,
  },
  buttonContent: {
    align: "center",
    justify: "center",
    gap: { base: "7px", sm: "8px" },
    minW: 0,
  },
  label: {
    color: "inherit",
    fontSize: "sm",
    fontWeight: "extrabold",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  likeButton: {
    _hover: {
      bg: "rgba(79, 131, 68, 0.1)",
      borderColor: "rgba(53, 87, 45, 0.26)",
      boxShadow: "0 9px 22px rgba(53, 87, 45, 0.11)",
    },
    _active: {
      bg: "rgba(79, 131, 68, 0.14)",
      borderColor: "rgba(53, 87, 45, 0.28)",
      boxShadow: "0 2px 8px rgba(53, 87, 45, 0.08)",
    },
  },
  nopeButton: {},
} as const;

type PersonPreviewActionButtonProps = PersonPreviewActionHandlers & {
  action: PersonPreviewAction;
  activeAction: ActivePersonPreviewAction;
  ariaLabel: string;
  buttonStyles: ButtonProps;
  filledIcon: string;
  icon: string;
  isSubmitting: boolean;
  label: string;
};

function PersonPreviewActionButton({
  action,
  activeAction,
  ariaLabel,
  buttonStyles,
  filledIcon,
  icon,
  isSubmitting,
  label,
  onActionStart,
}: PersonPreviewActionButtonProps) {
  const isCurrentActionSubmitting = isSubmitting && activeAction === action;

  const handleClick = () => {
    if (isSubmitting) {
      return;
    }

    onActionStart(action);
  };

  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      isDisabled={isSubmitting}
      onClick={handleClick}
      opacity={isCurrentActionSubmitting ? 1 : undefined}
      data-active={isCurrentActionSubmitting ? "true" : undefined}
      {...styles.button}
      {...buttonStyles}
    >
      <Flex {...styles.buttonContent}>
        <Box data-action-icon={action} {...styles.iconWrap}>
          <SvgImage
            src={icon}
            data-outline-icon
            boxSize="100%"
            {...styles.icon}
            {...styles.outlineIcon}
          />
          <SvgImage
            src={filledIcon}
            data-filled-icon
            boxSize="100%"
            {...styles.icon}
            {...styles.filledIcon}
          />
        </Box>
        <Text {...styles.label}>{label}</Text>
      </Flex>
    </Button>
  );
}

function LikeButton({
  activeAction,
  isSubmitting,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionHandlers &
  Pick<PersonPreviewActionButtonProps, "activeAction" | "isSubmitting">) {
  return (
    <PersonPreviewActionButton
      action="like"
      activeAction={activeAction}
      ariaLabel="Páči sa mi"
      filledIcon={thumbUpFilledIcon}
      icon={thumbUpIcon}
      isSubmitting={isSubmitting}
      label="Áno"
      onActionEnd={onActionEnd}
      onActionStart={onActionStart}
      buttonStyles={styles.likeButton}
    />
  );
}

function NopeButton({
  activeAction,
  isSubmitting,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionHandlers &
  Pick<PersonPreviewActionButtonProps, "activeAction" | "isSubmitting">) {
  return (
    <PersonPreviewActionButton
      action="nope"
      activeAction={activeAction}
      ariaLabel="Nepáči sa mi"
      filledIcon={thumbDownFilledIcon}
      icon={thumbDownIcon}
      isSubmitting={isSubmitting}
      label="Nie"
      onActionEnd={onActionEnd}
      onActionStart={onActionStart}
      buttonStyles={styles.nopeButton}
    />
  );
}

export function PersonPreviewActionButtons({
  activeAction,
  isSubmitting,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionHandlers &
  Pick<PersonPreviewActionButtonProps, "activeAction" | "isSubmitting">) {
  return (
    <Flex {...styles.grid}>
      <LikeButton
        activeAction={activeAction}
        isSubmitting={isSubmitting}
        onActionEnd={onActionEnd}
        onActionStart={onActionStart}
      />
      <NopeButton
        activeAction={activeAction}
        isSubmitting={isSubmitting}
        onActionEnd={onActionEnd}
        onActionStart={onActionStart}
      />
    </Flex>
  );
}
