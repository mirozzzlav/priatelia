import type { ReactNode } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";

import thumbDownIcon from "assets/thumb-down.svg";
import thumbUpIcon from "assets/thumb-up.svg";
import { LoadingPill } from "src/components/LoadingPill";
import type {
  ActivePersonPreviewAction,
  PersonPreview,
  PersonPreviewAction,
} from "src/features/person-preview/types";

const styles = {
  stage: {
    position: "relative",
    h: "min(58vh, 560px)",
    minH: { base: "360px", sm: "390px" },
    mt: { base: "12px", sm: "16px" },
    sx: {
      touchAction: "pan-y",
    },
  },
  card: {
    position: "relative",
    inset: 0,
    h: "100%",
    overflow: "hidden",
    borderRadius: "28px",
    bg: "app.base",
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
  photo: {
    position: "absolute",
    inset: 0,
    w: "100%",
    h: "100%",
    objectFit: "cover",
    pointerEvents: "none",
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
  person: PersonPreview;
};

export function PersonPreviewPhoto({
  activeAction,
  isLoadingNextPerson,
  person,
}: PersonPreviewPhotoProps) {
  const actionIcon = activeAction === "like" ? thumbUpIcon : thumbDownIcon;

  return (
    <Box {...styles.stage}>
      <Box as="article" {...styles.card} {...styles.activeCard(activeAction)}>
        <Image
          src={person.photo}
          alt={`${person.name}, hlavná profilová fotka`}
          {...styles.photo}
        />
        <DecisionBadge activeAction={activeAction} side="nope">
          NIE
        </DecisionBadge>
        <DecisionBadge activeAction={activeAction} side="like">
          ÁNO
        </DecisionBadge>
      </Box>
      {isLoadingNextPerson && (
        <Flex {...styles.transitionOverlay}>
          <LoadingPill icon={actionIcon} text="Hľadám ti ďalšieho priateľa." />
        </Flex>
      )}
    </Box>
  );
}
