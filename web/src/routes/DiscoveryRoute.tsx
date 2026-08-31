import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { ScrollCue } from "src/components/ScrollCue";
import { InfoScreen } from "src/features/info";
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
    if (personPreview || isLoadingPersonPreview || error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void onPersonPreviewLoad();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [error, isLoadingPersonPreview, onPersonPreviewLoad, personPreview]);

  return (
    <Box {...styles.deck}>
      {isLoadingPersonPreview && !personPreview && (
        <CenteredStatusLayout minH="calc(100vh - 108px)" px="16px" py={0}>
          <LoadingPill text="Hľadám ti ďalšieho priateľa." />
        </CenteredStatusLayout>
      )}
      {error && (
        <InfoScreen
          message="V tejto chvíli sa nám nepodarilo nájsť žiadneho nového priateľa, skús upraviť podmienky hľadania."
          title="Žiadny nový priateľ"
          variant="info"
        />
      )}
      {personPreview && (
        <>
          <PersonPreviewToolbar
            person={personPreview}
          />
          <PersonPreviewPhoto
            activeAction={activeAction}
            isLoadingNextPerson={isSubmittingPersonPreviewAction}
            isSubmitting={isSubmittingPersonPreviewAction}
            onActionEnd={onActionEnd}
            onActionStart={onActionStart}
            person={personPreview}
          />
          <ScrollCue />
          <PersonPreviewDetail person={personPreview} />
        </>
      )}
    </Box>
  );
}
