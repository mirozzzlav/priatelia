import { Box, Button, Text } from "@chakra-ui/react";

import logoIcon from "assets/logo.svg";
import matchIcon from "assets/match.svg";
import { PrimaryButton, SecondaryButton } from "src/components/formElements";
import { PanelHeading } from "src/components/PanelHeading";
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
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "12px", sm: "16px" },
    pt: "16px",
    pb: "calc(12px + env(safe-area-inset-bottom))",
    bg: "rgba(255, 255, 255, 0.94)",
    borderTop: "1px solid",
    borderColor: "app.borderColor",
    boxShadow: "0 -12px 28px rgba(53, 87, 45, 0.12)",
    backdropFilter: "blur(14px)",
  },
  panel: {
    mx: { base: "2px", sm: "8px" },
    px: { base: "26px", sm: "30px" },
  },
  matchGrid: {
    display: "grid",
    gridTemplateColumns: { base: "1fr", sm: "1fr 1fr" },
    gap: "10px",
  },
  matchStatus: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    w: "100%",
    h: "52px",
    minW: 0,
    px: "18px",
    border: "1px solid",
    borderColor: "app.errorBorder",
    borderRadius: "999px",
    bg: "rgba(159, 63, 74, 0.1)",
    boxShadow: "0 6px 14px rgba(159, 63, 74, 0.08)",
    color: "app.error",
    cursor: "default",
    _hover: {
      bg: "rgba(159, 63, 74, 0.1)",
    },
    _active: {
      bg: "rgba(159, 63, 74, 0.1)",
    },
  },
  matchStatusIcon: {
    boxSize: "24px",
    filter:
      "brightness(0) saturate(100%) invert(30%) sepia(25%) saturate(1265%) hue-rotate(303deg) brightness(93%) contrast(90%)",
    animation: "matchHeartPulse 1.35s ease-in-out infinite",
  },
  matchStatusText: {
    fontSize: "sm",
    fontWeight: "black",
    lineHeight: 1,
    textTransform: "uppercase",
  },
  matchButton: {
    w: "100%",
  },
  continueButton: {
    w: "100%",
    gridColumn: { base: undefined, sm: "1 / -1" },
    gap: "8px",
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
    <Box {...styles.root} sx={styles.keyframes}>
      <Box {...styles.panel}>
        {isMatched ? (
          <Box {...styles.matchGrid}>
            <Button type="button" tabIndex={-1} {...styles.matchStatus}>
              <SvgImage src={matchIcon} {...styles.matchStatusIcon} />
              <Text {...styles.matchStatusText}>Nastal match</Text>
            </Button>
            <SecondaryButton
              isDisabled={isSubmitting || !onMessageClick}
              onClick={onMessageClick}
              {...styles.matchButton}
            >
              Napísať správu
            </SecondaryButton>
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
            <PanelHeading spacing="loose">Chceš ma spoznať?</PanelHeading>
            <PersonPreviewActionButtons
              activeAction={activeAction}
              isSubmitting={isSubmitting}
              onActionEnd={onActionEnd}
              onActionStart={onActionStart}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
