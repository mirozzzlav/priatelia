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
  group: {
    align: "stretch",
    w: "100%",
    h: { base: "52px", sm: "54px" },
    overflow: "hidden",
    border: "1px solid",
    borderColor: "app.borderColor",
    borderRadius: "999px",
    bg: "app.white",
    boxShadow: "0 7px 18px rgba(53, 87, 45, 0.08)",
    transition: "border-color 140ms ease, box-shadow 140ms ease",
    _focusWithin: {
      borderColor: "app.borderColorStrong",
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.12)",
    },
  },
  divider: {
    alignSelf: "stretch",
    w: "1px",
    bg: "app.borderColor",
  },
  button: {
    flex: "1 1 0",
    h: "100%",
    minW: 0,
    px: { base: "14px", sm: "18px" },
    py: 0,
    border: 0,
    borderRadius: 0,
    bg: "transparent",
    color: "app.text",
    boxShadow: "none",
    transition: "background 140ms ease",
    _hover: {
      bg: "rgba(79, 131, 68, 0.1)",
    },
    _active: {
      bg: "rgba(79, 131, 68, 0.14)",
    },
    _focusVisible: {
      boxShadow: "inset 0 0 0 2px rgba(79, 131, 68, 0.24)",
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
  segmentButton: {
    flex: "1 1 0",
    minW: 0,
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
  likeButton: {},
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
      {...styles.segmentButton}
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
    <Flex {...styles.group}>
      <LikeButton
        activeAction={activeAction}
        isSubmitting={isSubmitting}
        onActionEnd={onActionEnd}
        onActionStart={onActionStart}
      />
      <Box aria-hidden="true" {...styles.divider} />
      <NopeButton
        activeAction={activeAction}
        isSubmitting={isSubmitting}
        onActionEnd={onActionEnd}
        onActionStart={onActionStart}
      />
    </Flex>
  );
}
