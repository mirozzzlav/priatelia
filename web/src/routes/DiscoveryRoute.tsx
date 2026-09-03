import { useEffect, useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { PhotoViewer } from "src/components/PhotoViewer";
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const previewPhotos = useMemo(() => {
    if (!personPreview) {
      return [];
    }

    const photoUrls = Array.from(
      new Set([personPreview.photo, ...personPreview.photos]),
    );

    return photoUrls.map((src, index) => ({
      alt: `${personPreview.name}, fotka ${index + 1}`,
      src,
    }));
  }, [personPreview]);
  const openPreviewPhoto = (photoSrc: string) => {
    const photoIndex = previewPhotos.findIndex((photo) => photo.src === photoSrc);
    setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
  };

  useEffect(() => {
    if (personPreview || isLoadingPersonPreview || error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void onPersonPreviewLoad();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [error, isLoadingPersonPreview, onPersonPreviewLoad, personPreview]);

  if (isLoadingPersonPreview && !personPreview) {
    return (
      <Box {...styles.deck}>
        <CenteredStatusLayout minH="calc(100vh - 108px)" px="16px" py={0}>
          <LoadingPill text="Hľadám ti ďalšieho priateľa." />
        </CenteredStatusLayout>
      </Box>
    );
  }

  if (error) {
    return (
      <Box {...styles.deck}>
        <InfoScreen
          message="V tejto chvíli sa nám nepodarilo nájsť žiadneho nového priateľa, skús upraviť podmienky hľadania."
          title="Žiadny nový priateľ"
          variant="info"
        />
      </Box>
    );
  }

  return (
    <Box {...styles.deck}>
      {personPreview && (
        <>
          <PersonPreviewToolbar person={personPreview} />
          <PersonPreviewPhoto
            activeAction={activeAction}
            isLoadingNextPerson={isSubmittingPersonPreviewAction}
            isSubmitting={isSubmittingPersonPreviewAction}
            onActionEnd={onActionEnd}
            onActionStart={onActionStart}
            onPhotoClick={() => setSelectedPhotoIndex(0)}
            person={personPreview}
          />
          <ScrollCue />
          <PersonPreviewDetail
            onPhotoClick={openPreviewPhoto}
            person={personPreview}
          />
          <PhotoViewer
            initialIndex={selectedPhotoIndex}
            isOpen={selectedPhotoIndex !== null}
            onClose={() => setSelectedPhotoIndex(null)}
            onIndexChange={setSelectedPhotoIndex}
            photos={previewPhotos}
          />
        </>
      )}
    </Box>
  );
}
