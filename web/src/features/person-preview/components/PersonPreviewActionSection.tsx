import { Box, Flex, Icon, Text } from "@chakra-ui/react";

import logoIcon from "assets/logo.svg";
import { MessageButton } from "src/components/MessageButton";
import { SurfaceBand } from "src/components/SurfaceBand";
import { SurfaceLabel } from "src/components/SurfaceLabel";
import { PrimaryButton } from "src/components/formElements";
import { SvgImage } from "src/components/SvgImage";
import { PersonPreviewActionButtons } from "src/features/person-preview/components/PersonPreviewActionButtons";
import type {
  ActivePersonPreviewAction,
  PersonPreviewActionHandlers,
} from "src/features/person-preview/types";

const styles = {
  root: {
    position: "sticky",
    bottom: 0,
    zIndex: 40,
    borderBottom: 0,
    backdropFilter: "blur(14px)",
  },
  panel: {
    mx: 0,
    px: 0,
  },
  actionPrompt: {
    mb: "10px",
  },
  actionPromptIcon: {
    boxSize: { base: "17px", sm: "18px" },
  },
  matchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },
  matchStatus: {
    gridColumn: "1 / -1",
    w: "100%",
    minW: 0,
    px: { base: "18px", sm: "22px" },
    py: "14px",
    border: "1px solid",
    borderColor: "app.errorBorder",
    borderRadius: "18px",
    bg: "rgba(159, 63, 74, 0.1)",
    boxShadow: "0 6px 14px rgba(159, 63, 74, 0.08)",
    color: "app.error",
  },
  matchStatusHeader: {
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  matchStatusIcon: {
    boxSize: "24px",
    animation: "matchHeartPulse 1.35s ease-in-out infinite",
  },
  matchStatusText: {
    fontSize: "sm",
    fontWeight: "black",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  matchStatusDescription: {
    mt: "8px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "bold",
    lineHeight: 1.35,
    textAlign: "center",
    opacity: 0.72,
  },
  matchButton: {
    w: "100%",
  },
  continueButton: {
    w: "100%",
    gap: "8px",
    fontSize: "sm",
  },
  continueIcon: {
    boxSize: "31px",
    filter: "brightness(0) invert(1)",
  },
  keyframes: {
    "@keyframes matchHeartPulse": {
      "0%, 100%": {
        transform: "scale(1)",
      },
      "18%": {
        transform: "scale(1.22)",
      },
      "34%": {
        transform: "scale(0.98)",
      },
      "48%": {
        transform: "scale(1.12)",
      },
    },
  },
} as const;

type PersonPreviewActionSectionProps = PersonPreviewActionHandlers & {
  activeAction: ActivePersonPreviewAction;
  isSubmitting: boolean;
  matchId?: string | null;
  onContinueDiscovery?: () => void;
  onMessageClick?: () => void;
};

export function PersonPreviewActionSection({
  activeAction,
  isSubmitting,
  matchId,
  onContinueDiscovery,
  onMessageClick,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionSectionProps) {
  const isMatched = Boolean(matchId);

  return (
    <SurfaceBand {...styles.root} surfaceShadow="above" sx={styles.keyframes}>
      <Box {...styles.panel}>
        {isMatched ? (
          <Box {...styles.matchGrid}>
            <Box {...styles.matchStatus}>
              <Flex {...styles.matchStatusHeader}>
                <MatchStatusIcon />
                <Text {...styles.matchStatusText}>Ste prepojení</Text>
              </Flex>
              <Text {...styles.matchStatusDescription}>
                Vzájomne ste si dali áno, preto si teraz môžete napísať.
              </Text>
            </Box>
            <MessageButton
              isDisabled={isSubmitting || !onMessageClick}
              onClick={onMessageClick}
              gridColumn={onContinueDiscovery ? undefined : "1 / -1"}
              {...styles.matchButton}
            />
            {onContinueDiscovery && (
              <PrimaryButton
                type="button"
                isDisabled={isSubmitting}
                onClick={onContinueDiscovery}
                {...styles.continueButton}
              >
                <SvgImage src={logoIcon} {...styles.continueIcon} />
                Ďalej objavuj
              </PrimaryButton>
            )}
          </Box>
        ) : (
          <>
            <Box {...styles.actionPrompt}>
              <SurfaceLabel
                icon={<ActionPromptIcon />}
                title="Chceš ma spoznať?"
              />
            </Box>
            <PersonPreviewActionButtons
              activeAction={activeAction}
              isSubmitting={isSubmitting}
              onActionEnd={onActionEnd}
              onActionStart={onActionStart}
            />
          </>
        )}
      </Box>
    </SurfaceBand>
  );
}

function ActionPromptIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      aria-hidden="true"
      {...styles.actionPromptIcon}
    >
      <path d="M12 20.1 5.72 14.4C2.2 11.2 2.96 6.25 6.95 5.06c1.9-.57 3.64.1 5.05 1.72 1.41-1.62 3.15-2.29 5.05-1.72 3.99 1.19 4.75 6.14 1.23 9.34L12 20.1Z" />
    </Icon>
  );
}

function MatchStatusIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      aria-hidden="true"
      {...styles.matchStatusIcon}
    >
      <path d="M12 20.1 5.72 14.4C2.2 11.2 2.96 6.25 6.95 5.06c1.9-.57 3.64.1 5.05 1.72 1.41-1.62 3.15-2.29 5.05-1.72 3.99 1.19 4.75 6.14 1.23 9.34L12 20.1Z" />
    </Icon>
  );
}
