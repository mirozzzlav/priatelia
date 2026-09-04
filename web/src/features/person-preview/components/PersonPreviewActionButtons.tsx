import type { KeyboardEvent } from "react";
import { Box, Button, Flex, type ButtonProps } from "@chakra-ui/react";

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
    gap: 0,
  },
  button: {
    flex: "1 1 50%",
    h: "68px",
    minW: 0,
    p: 0,
    border: 0,
    borderTop: "1px solid",
    borderColor: "rgba(255, 255, 255, 0.46)",
    borderRadius: 0,
    bg: "rgba(255, 255, 255, 0.72)",
    backdropFilter: "blur(16px)",
    transition: "background 140ms ease, border-color 140ms ease",
    _hover: {
      bg: "rgba(255, 255, 255, 0.86)",
      borderColor: "rgba(255, 255, 255, 0.72)",
    },
    _active: {
      bg: "rgba(255, 255, 255, 0.92)",
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
      "&:hover [data-action-icon='like']": {
        animation: "thumbUpHover 360ms ease both",
      },
      "&:hover [data-action-icon='nope']": {
        animation: "thumbDownHover 360ms ease both",
      },
      "@keyframes thumbUpHover": {
        "0%": {
          transform: "translateY(0) rotate(0deg)",
        },
        "45%": {
          transform: "translateY(-3px) rotate(-6deg)",
        },
        "100%": {
          transform: "translateY(0) rotate(0deg)",
        },
      },
      "@keyframes thumbDownHover": {
        "0%": {
          transform: "translateY(0) rotate(0deg)",
        },
        "45%": {
          transform: "translateY(3px) rotate(-6deg)",
        },
        "100%": {
          transform: "translateY(0) rotate(0deg)",
        },
      },
    },
    _disabled: {
      opacity: 0.54,
      cursor: "not-allowed",
    },
  },
  iconWrap: {
    position: "relative",
    boxSize: "39px",
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
  likeButton: {
    borderRight: "1px solid",
    borderRightColor: "rgba(38, 57, 111, 0.36)",
    _hover: {
      bg: "rgba(255, 255, 255, 0.86)",
      borderColor: "rgba(255, 255, 255, 0.72)",
      borderRightColor: "rgba(38, 57, 111, 0.36)",
    },
    _active: {
      bg: "rgba(255, 255, 255, 0.92)",
      borderRightColor: "rgba(38, 57, 111, 0.36)",
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
};

function PersonPreviewActionButton({
  action,
  activeAction,
  ariaLabel,
  buttonStyles,
  filledIcon,
  icon,
  isSubmitting,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionButtonProps) {
  const isCurrentActionSubmitting = isSubmitting && activeAction === action;

  const startAction = () => {
    if (isSubmitting) {
      return;
    }

    onActionStart(action);
  };

  const endAction = () => {
    onActionEnd();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      startAction();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      endAction();
    }
  };

  return (
    <Button
      type="button"
      aria-label={ariaLabel}
      isDisabled={isSubmitting}
      onBlur={endAction}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onPointerCancel={endAction}
      onPointerDown={startAction}
      onPointerLeave={endAction}
      onPointerUp={endAction}
      opacity={isCurrentActionSubmitting ? 1 : undefined}
      data-active={isCurrentActionSubmitting ? "true" : undefined}
      {...styles.button}
      {...buttonStyles}
    >
      <Box data-action-icon={action} {...styles.iconWrap}>
        <SvgImage
          src={icon}
          boxSize="39px"
          data-outline-icon
          {...styles.icon}
          {...styles.outlineIcon}
        />
        <SvgImage
          src={filledIcon}
          boxSize="39px"
          data-filled-icon
          {...styles.icon}
          {...styles.filledIcon}
        />
      </Box>
    </Button>
  );
}

function LikeButton({
  activeAction,
  isSubmitting,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionHandlers & Pick<
  PersonPreviewActionButtonProps,
  "activeAction" | "isSubmitting"
>) {
  return (
    <PersonPreviewActionButton
      action="like"
      activeAction={activeAction}
      ariaLabel="Páči sa mi"
      filledIcon={thumbUpFilledIcon}
      icon={thumbUpIcon}
      isSubmitting={isSubmitting}
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
}: PersonPreviewActionHandlers & Pick<
  PersonPreviewActionButtonProps,
  "activeAction" | "isSubmitting"
>) {
  return (
    <PersonPreviewActionButton
      action="nope"
      activeAction={activeAction}
      ariaLabel="Nepáči sa mi"
      filledIcon={thumbDownFilledIcon}
      icon={thumbDownIcon}
      isSubmitting={isSubmitting}
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
}: PersonPreviewActionHandlers & Pick<
  PersonPreviewActionButtonProps,
  "activeAction" | "isSubmitting"
>) {
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
