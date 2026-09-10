import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { PhotoViewer } from "src/components/PhotoViewer";
import { useChatMatches } from "src/context/chatMatches";
import { DiscoveryIntroBanner, DiscoveryTopPanel } from "src/features/discovery";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { InfoScreen } from "src/features/info";
import {
  type ActivePersonPreviewAction,
  PersonPreviewActionSection,
  PersonPreviewDetail,
  PersonPreviewPhoto,
  type PersonPreview,
} from "src/features/person-preview";
import type { ChatMatch, ProfileActionResult } from "src/services/api";

type DiscoveryRouteProps = {
  activeAction: ActivePersonPreviewAction;
  error: string | null;
  isLoadingPersonPreview: boolean;
  isSubmittingPersonPreviewAction: boolean;
  initialDiscoverySettings: DiscoverySettingsData;
  onActionEnd: () => void;
  onActionStart: (
    action: ActivePersonPreviewAction,
    onAfterSuccessfulAction?: (result: ProfileActionResult) => Promise<void> | void,
  ) => void;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
  onPersonPreviewLoad: () => Promise<void>;
  personPreview: PersonPreview | null;
};

const styles = {
  deck: {
    minH: "calc(100dvh - 64px)",
    display: "flex",
    flexDirection: "column",
    px: { base: "12px", sm: "16px" },
    pb: "22px",
  },
  stickyHeader: {
    position: "sticky",
    top: "64px",
    zIndex: 20,
  },
} as const;

export function DiscoveryRoute({
  activeAction,
  error,
  isLoadingPersonPreview,
  isSubmittingPersonPreviewAction,
  initialDiscoverySettings,
  onActionEnd,
  onActionStart,
  onDiscoveryReload,
  onDiscoverySettingsSave,
  onPersonPreviewLoad,
  personPreview,
}: DiscoveryRouteProps) {
  const navigate = useNavigate();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [matchedProfileMatch, setMatchedProfileMatch] =
    useState<ChatMatch | null>(null);
  const [isContinuingDiscovery, setIsContinuingDiscovery] = useState(false);
  const previousPersonPreviewIdRef = useRef<string | null>(null);
  const { addChatMatch } = useChatMatches();
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
  const openPreviewPhoto = useCallback(
    (photoSrc: string) => {
      const photoIndex = previewPhotos.findIndex(
        (photo) => photo.src === photoSrc,
      );
      setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
    },
    [previewPhotos],
  );
  const handleActionStart = useCallback(
    (action: ActivePersonPreviewAction) => {
      onActionStart(action, (result) => {
        if (result.match) {
          const newMatch = { ...result.match, isNew: true };
          setMatchedProfileMatch(newMatch);
          addChatMatch(newMatch);
        }
      });
    },
    [addChatMatch, onActionStart],
  );
  const handleContinueDiscovery = useCallback(() => {
    setMatchedProfileMatch(null);
    setIsContinuingDiscovery(true);
    void onPersonPreviewLoad().finally(() => {
      setIsContinuingDiscovery(false);
    });
  }, [onPersonPreviewLoad]);
  const handleMessageClick = useCallback(() => {
    if (matchedProfileMatch) {
      navigate(`/messages/${matchedProfileMatch.id}`);
    }
  }, [matchedProfileMatch, navigate]);
  const closePhotoViewer = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  useEffect(() => {
    if (personPreview || isLoadingPersonPreview || error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void onPersonPreviewLoad();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [error, isLoadingPersonPreview, onPersonPreviewLoad, personPreview]);

  useEffect(() => {
    if (!personPreview) {
      previousPersonPreviewIdRef.current = null;
      return;
    }

    const previousPersonPreviewId = previousPersonPreviewIdRef.current;
    previousPersonPreviewIdRef.current = personPreview.id;

    if (
      !previousPersonPreviewId ||
      previousPersonPreviewId === personPreview.id
    ) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [personPreview]);

  const discoveryTopPanel = (
    <Box {...styles.stickyHeader}>
      <DiscoveryTopPanel
        initialDiscoverySettings={initialDiscoverySettings}
        onDiscoveryReload={onDiscoveryReload}
        onDiscoverySettingsSave={onDiscoverySettingsSave}
      />
    </Box>
  );

  if (isLoadingPersonPreview && !personPreview) {
    return (
      <Box {...styles.deck}>
        <DiscoveryIntroBanner />
        <CenteredStatusLayout minH="calc(100vh - 108px)" px="16px" py={0}>
          <LoadingPill text="Hľadám ti ďalšieho priateľa." />
        </CenteredStatusLayout>
      </Box>
    );
  }

  if (error) {
    const isEmptyDiscovery = error.includes("žiadneho nového priateľa");

    return (
      <Box {...styles.deck}>
        <DiscoveryIntroBanner />
        {isEmptyDiscovery && discoveryTopPanel}
        <InfoScreen
          flex="1"
          message={error}
          minH={0}
          py="24px"
          title={isEmptyDiscovery ? "Žiadny nový priateľ" : "Chyba načítania"}
          variant={isEmptyDiscovery ? "info" : "error"}
        />
      </Box>
    );
  }

  return (
    <Box {...styles.deck}>
      {personPreview && (
        <>
          <DiscoveryIntroBanner />
          {discoveryTopPanel}
          <PersonPreviewPhoto
            activeAction={activeAction}
            isMatched={Boolean(matchedProfileMatch)}
            isLoadingNextPerson={
              isSubmittingPersonPreviewAction || isContinuingDiscovery
            }
            onMessageClick={
              matchedProfileMatch ? handleMessageClick : undefined
            }
            person={personPreview}
          />
          <PersonPreviewDetail
            onPhotoClick={openPreviewPhoto}
            person={personPreview}
          />
          <PersonPreviewActionSection
            activeAction={activeAction}
            isSubmitting={
              isSubmittingPersonPreviewAction || isContinuingDiscovery
            }
            matchId={matchedProfileMatch?.id}
            onContinueDiscovery={handleContinueDiscovery}
            onActionEnd={onActionEnd}
            onActionStart={handleActionStart}
          />
          <PhotoViewer
            initialIndex={selectedPhotoIndex}
            isOpen={selectedPhotoIndex !== null}
            onClose={closePhotoViewer}
            onIndexChange={setSelectedPhotoIndex}
            photos={previewPhotos}
          />
        </>
      )}
    </Box>
  );
}
