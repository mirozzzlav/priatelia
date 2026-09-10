import { Box } from "@chakra-ui/react";

import logoIcon from "assets/logo.svg";
import { PrimaryButton } from "src/components/formElements";
import { SvgImage } from "src/components/SvgImage";
import { DetailSection } from "src/features/person-preview/components/DetailSection";
import { PersonPreviewActionButtons } from "src/features/person-preview/components/PersonPreviewActionButtons";
import type {
  ActivePersonPreviewAction,
  PersonPreviewActionHandlers,
} from "src/features/person-preview/types";

const styles = {
  actions: {
    p: "18px 0 0 0",
  },
  continueButton: {
    w: "100%",
    gap: "8px",
  },
  continueIcon: {
    boxSize: "31px",
    filter: "brightness(0) invert(1)",
  },
} as const;

type PersonPreviewActionSectionProps = PersonPreviewActionHandlers & {
  activeAction: ActivePersonPreviewAction;
  isSubmitting: boolean;
  matchId?: string | null;
  onContinueDiscovery?: () => void;
};

export function PersonPreviewActionSection({
  activeAction,
  isSubmitting,
  matchId,
  onContinueDiscovery,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionSectionProps) {
  const isMatched = Boolean(matchId);
  const title = isMatched ? "" : "Chceš ma spoznať?";

  return (
    <DetailSection title={title}>
      <Box {...styles.actions}>
        {isMatched ? (
          <PrimaryButton
            type="button"
            isDisabled={isSubmitting}
            onClick={onContinueDiscovery}
            {...styles.continueButton}
          >
            <SvgImage src={logoIcon} {...styles.continueIcon} />
            Ďalej objavuj
          </PrimaryButton>
        ) : (
          <PersonPreviewActionButtons
            activeAction={activeAction}
            isSubmitting={isSubmitting}
            onActionEnd={onActionEnd}
            onActionStart={onActionStart}
          />
        )}
      </Box>
    </DetailSection>
  );
}
