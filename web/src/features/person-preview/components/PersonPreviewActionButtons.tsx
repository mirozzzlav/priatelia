import type { KeyboardEvent } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";

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
    justify: "flex-start",
    gap: "16px",
  },
  button: {
    boxSize: "48px",
    minW: "48px",
    p: 0,
    border: "1px solid",
    borderColor: "rgba(255, 255, 255, 0.62)",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.88)",
    boxShadow: "0 10px 22px rgba(0, 0, 0, 0.16)",
    backdropFilter: "blur(14px)",
    transition:
      "background 140ms ease, border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease",
    _hover: {
      bg: "app.white",
      borderColor: "app.white",
      boxShadow: "0 12px 26px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-1px)",
    },
    _active: {
      bg: "app.white",
      transform: "translateY(0)",
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
      "&:hover [data-action-icon], &:active [data-action-icon], &[data-active='true'] [data-action-icon]":
        {
          transform: "scale(1.08)",
        },
    },
    _disabled: {
      opacity: 0.54,
      cursor: "not-allowed",
    },
  },
  iconWrap: {
    position: "relative",
    boxSize: "34px",
    transition: "transform 140ms ease",
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
} as const;

type PersonPreviewActionButtonProps = PersonPreviewActionHandlers & {
  action: PersonPreviewAction;
  activeAction: ActivePersonPreviewAction;
  ariaLabel: string;
  filledIcon: string;
  icon: string;
  isSubmitting: boolean;
};

function PersonPreviewActionButton({
  action,
  activeAction,
  ariaLabel,
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
    >
      <Box data-action-icon {...styles.iconWrap}>
        <SvgImage
          src={icon}
          boxSize="34px"
          data-outline-icon
          {...styles.icon}
          {...styles.outlineIcon}
        />
        <SvgImage
          src={filledIcon}
          boxSize="34px"
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
