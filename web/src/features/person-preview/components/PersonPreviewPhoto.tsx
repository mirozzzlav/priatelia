import type { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";

import thumbDownIcon from "assets/thumb-down.svg";
import thumbUpIcon from "assets/thumb-up.svg";
import { LoadingPill } from "src/components/LoadingPill";
import { PersonPreviewToolbar } from "src/features/person-preview/components/PersonPreviewToolbar";
import type {
  ActivePersonPreviewAction,
  PersonPreview,
} from "src/features/person-preview/types";

const styles = {
  stage: {
    position: "relative",
    sx: {
      touchAction: "pan-y",
    },
  },
  identityBlock: {
    position: "relative",
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
    side: NonNullable<ActivePersonPreviewAction>,
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
      pointerEvents: "none",
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
  side: NonNullable<ActivePersonPreviewAction>;
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
  showDecisionBadges?: boolean;
};

export function PersonPreviewPhoto({
  activeAction,
  isLoadingNextPerson,
  person,
  showDecisionBadges = true,
}: PersonPreviewPhotoProps) {
  const actionIcon = activeAction === "like" ? thumbUpIcon : thumbDownIcon;

  return (
    <Box {...styles.stage}>
      <Box
        as="article"
        {...styles.identityBlock}
        {...styles.activeCard(activeAction)}
      >
        <PersonPreviewToolbar person={person} />
        {showDecisionBadges && (
          <>
            <DecisionBadge activeAction={activeAction} side="nope">
              NIE
            </DecisionBadge>
            <DecisionBadge activeAction={activeAction} side="like">
              ÁNO
            </DecisionBadge>
          </>
        )}
      </Box>
      {isLoadingNextPerson && (
        <Flex {...styles.transitionOverlay}>
          <LoadingPill icon={actionIcon} text="Hľadám ti ďalšieho priateľa." />
        </Flex>
      )}
    </Box>
  );
}
