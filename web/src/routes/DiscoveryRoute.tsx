import { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { ScrollCue } from "src/components/ScrollCue";
import {
  type ActivePersonPreviewAction,
  PersonPreviewDetail,
  PersonPreviewPhoto,
  PersonPreviewToolbar,
  type PersonPreview,
} from "src/features/person-preview";

type DiscoveryRouteProps = {
  activeAction: ActivePersonPreviewAction;
  error: string | null;
  isLoadingPersonPreview: boolean;
  isSubmittingPersonPreviewAction: boolean;
  onActionEnd: () => void;
  onActionStart: (action: ActivePersonPreviewAction) => void;
  onPersonPreviewLoad: () => Promise<void>;
  personPreview: PersonPreview | null;
};

const styles = {
  deck: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "22px",
  },
  error: {
    color: "app.text",
    fontSize: "sm",
    fontWeight: "extrabold",
  },
} as const;

export function DiscoveryRoute({
  activeAction,
  error,
  isLoadingPersonPreview,
  isSubmittingPersonPreviewAction,
  onActionEnd,
  onActionStart,
  onPersonPreviewLoad,
  personPreview,
}: DiscoveryRouteProps) {
  useEffect(() => {
    if (personPreview || isLoadingPersonPreview) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void onPersonPreviewLoad();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isLoadingPersonPreview, onPersonPreviewLoad, personPreview]);

  return (
    <Box {...styles.deck}>
      {isLoadingPersonPreview && !personPreview && (
        <CenteredStatusLayout minH="calc(100vh - 108px)" px="16px" py={0}>
          <LoadingPill text="Hľadám ti ďalšieho priateľa." />
        </CenteredStatusLayout>
      )}
      {error && (
        <CenteredStatusLayout minH="calc(100vh - 108px)" px="16px" py={0}>
          <Text {...styles.error}>{error}</Text>
        </CenteredStatusLayout>
      )}
      {personPreview && (
        <>
          <PersonPreviewToolbar
            person={personPreview}
            activeAction={activeAction}
            isSubmitting={isSubmittingPersonPreviewAction}
            onActionEnd={onActionEnd}
            onActionStart={onActionStart}
          />
          <PersonPreviewPhoto
            activeAction={activeAction}
            isLoadingNextPerson={isSubmittingPersonPreviewAction}
            person={personPreview}
          />
          <ScrollCue />
          <PersonPreviewDetail person={personPreview} />
        </>
      )}
    </Box>
  );
}
