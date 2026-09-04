import type { ReactNode } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";

import thumbDownIcon from "assets/thumb-down.svg";
import thumbUpIcon from "assets/thumb-up.svg";
import { LoadingPill } from "src/components/LoadingPill";
import { PersonPreviewActionButtons } from "src/features/person-preview/components/PersonPreviewActionButtons";
import { PersonPreviewToolbar } from "src/features/person-preview/components/PersonPreviewToolbar";
import type {
  ActivePersonPreviewAction,
  PersonPreview,
  PersonPreviewAction,
  PersonPreviewActionHandlers,
} from "src/features/person-preview/types";

const styles = {
  stage: {
    position: "relative",
    h: "min(52vh, 520px)",
    minH: { base: "320px", sm: "350px" },
    mt: { base: "22px", sm: "28px" },
    sx: {
      touchAction: "pan-y",
    },
  },
  card: {
    position: "relative",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    h: "100%",
    overflow: "hidden",
    border: "1px solid",
    borderColor: "rgba(38, 57, 111, 0.14)",
    borderRadius: "28px",
    bg: "app.white",
    boxShadow: "0 18px 42px rgba(38, 57, 111, 0.18)",
    transformOrigin: "50% 86%",
    transition: "transform 180ms ease, opacity 180ms ease",
    userSelect: "none",
  },
  activeCard: (activeAction: ActivePersonPreviewAction) => {
    if (activeAction === "like") {
      return {
        transform: "translateX(-18px) rotate(-2.5deg)",
      } as const;
    }

    if (activeAction === "nope") {
      return {
        transform: "translateX(18px) rotate(2.5deg)",
      } as const;
    }

    return {};
  },
  photoArea: {
    position: "relative",
    flex: 1,
    minH: 0,
    overflow: "hidden",
    bg: "app.base",
  },
  photo: {
    position: "absolute",
    inset: 0,
    w: "100%",
    h: "100%",
    cursor: "zoom-in",
    objectFit: "cover",
  },
  actions: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
  },
  transitionOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    align: "center",
    justify: "center",
    pointerEvents: "none",
  },
  decisionBadge: (
    activeAction: ActivePersonPreviewAction,
    side: PersonPreviewAction,
  ) =>
    ({
      position: "absolute",
      top: "28px",
      zIndex: 2,
      px: "14px",
      py: "8px",
      border: "2px solid",
      borderColor: "app.white",
      borderRadius: "12px",
      color: "app.white",
      fontSize: "xl",
      fontWeight: "black",
      letterSpacing: 0,
      opacity: activeAction === side ? 1 : 0,
    }) as const,
  nopeBadge: {
    right: "24px",
    bg: "app.base",
    transform: "rotate(-11deg)",
  },
  likeBadge: {
    left: "24px",
    bg: "app.info",
    transform: "rotate(11deg)",
  },
} as const;

type DecisionBadgeProps = {
  activeAction: ActivePersonPreviewAction;
  children: ReactNode;
  side: PersonPreviewAction;
};

function DecisionBadge({ activeAction, children, side }: DecisionBadgeProps) {
  const sideStyles = side === "like" ? styles.likeBadge : styles.nopeBadge;

  return (
    <Box {...styles.decisionBadge(activeAction, side)} {...sideStyles}>
      {children}
    </Box>
  );
}

type PersonPreviewPhotoProps = {
  activeAction: ActivePersonPreviewAction;
  isLoadingNextPerson: boolean;
  isSubmitting: boolean;
  onPhotoClick: () => void;
  person: PersonPreview;
} & PersonPreviewActionHandlers;

export function PersonPreviewPhoto({
  activeAction,
  isLoadingNextPerson,
  isSubmitting,
  onActionEnd,
  onActionStart,
  onPhotoClick,
  person,
}: PersonPreviewPhotoProps) {
  const actionIcon = activeAction === "like" ? thumbUpIcon : thumbDownIcon;

  return (
    <Box {...styles.stage}>
      <Box as="article" {...styles.card} {...styles.activeCard(activeAction)}>
        <PersonPreviewToolbar person={person} />
        <Box {...styles.photoArea}>
          <Image
            src={person.photo}
            alt={`${person.name}, hlavná profilová fotka`}
            onClick={onPhotoClick}
            {...styles.photo}
          />
          <DecisionBadge activeAction={activeAction} side="nope">
            NIE
          </DecisionBadge>
          <DecisionBadge activeAction={activeAction} side="like">
            ÁNO
          </DecisionBadge>
          <Box {...styles.actions}>
            <PersonPreviewActionButtons
              activeAction={activeAction}
              isSubmitting={isSubmitting}
              onActionEnd={onActionEnd}
              onActionStart={onActionStart}
            />
          </Box>
        </Box>
      </Box>
      {isLoadingNextPerson && (
        <Flex {...styles.transitionOverlay}>
          <LoadingPill icon={actionIcon} text="Hľadám ti ďalšieho priateľa." />
        </Flex>
      )}
    </Box>
  );
}
