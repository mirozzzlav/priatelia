import { Box } from "@chakra-ui/react";

import { DetailSection } from "src/features/person-preview/components/DetailSection";
import { PersonPreviewActionButtons } from "src/features/person-preview/components/PersonPreviewActionButtons";
import type {
  ActivePersonPreviewAction,
  PersonPreviewActionHandlers,
} from "src/features/person-preview/types";

const styles = {
  actions: {
    pb: "5px",
  },
} as const;

type PersonPreviewActionSectionProps = PersonPreviewActionHandlers & {
  activeAction: ActivePersonPreviewAction;
  isSubmitting: boolean;
};

export function PersonPreviewActionSection({
  activeAction,
  isSubmitting,
  onActionEnd,
  onActionStart,
}: PersonPreviewActionSectionProps) {
  return (
    <DetailSection title="Chceš ma spoznať?">
      <Box {...styles.actions}>
        <PersonPreviewActionButtons
          activeAction={activeAction}
          isSubmitting={isSubmitting}
          onActionEnd={onActionEnd}
          onActionStart={onActionStart}
        />
      </Box>
    </DetailSection>
  );
}
