import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import happySmileIcon from "assets/happy-smile.svg";
import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { PhotoViewer } from "src/components/PhotoViewer";
import { PillGroup } from "src/components/PillGroup";
import { useChatMatches } from "src/context/chatMatches";
import {
  DiscoveryFeedbackBanner,
  DiscoveryIntroBanner,
  DiscoveryTopPanel,
} from "src/features/discovery";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import { InfoScreen } from "src/features/info";
import {
  type ActivePersonPreviewAction,
  PersonPreviewActionSection,
  PersonPreviewDetail,
  PersonPreviewHeader,
  type PersonPreview,
} from "src/features/person-preview";
import type { ChatMatch, ProfileActionResult } from "src/services/api";

type DiscoveryRouteProps = {
  activeAction: ActivePersonPreviewAction;
  error: string | null;
  isLoadingPersonPreview: boolean;
  isSubmittingPersonPreviewAction: boolean;
  initialDiscoverySettings: DiscoverySettingsData;
  matchedProfileMatch: ChatMatch | null;
  onActionEnd: () => void;
  onActionStart: (
    action: ActivePersonPreviewAction,
    onAfterSuccessfulAction?: (
      result: ProfileActionResult,
    ) => Promise<void> | void,
  ) => void;
  onDiscoveryReload: () => Promise<void>;
  onDiscoverySettingsSave: (data: DiscoverySettingsData) => void;
  onMatchedProfileMatchClear: () => void;
  onPersonPreviewLoad: () => Promise<void>;
  personPreview: PersonPreview | null;
};

const styles = {
  deck: {
    minH: "calc(100dvh - 64px)",
    display: "flex",
    flexDirection: "column",
    px: { base: "12px", sm: "16px" },
    pb: 0,
  },
  stickyHeader: {
    position: "sticky",
    top: "64px",
    zIndex: 45,
    bg: "app.white",
  },
} as const;

const isDiscoveryFeedbackEnabled =
  import.meta.env.VITE_DISCOVERY_FEEDBACK_ENABLED !== "false";

function scrollDiscoveryToTop() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

export function DiscoveryRoute({
  activeAction,
  error,
  isLoadingPersonPreview,
  isSubmittingPersonPreviewAction,
  initialDiscoverySettings,
  matchedProfileMatch,
  onActionEnd,
  onActionStart,
  onDiscoveryReload,
  onDiscoverySettingsSave,
  onMatchedProfileMatchClear,
  onPersonPreviewLoad,
  personPreview,
}: DiscoveryRouteProps) {
  const navigate = useNavigate();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [isDiscoveryFilterPanelOpen, setIsDiscoveryFilterPanelOpen] =
    useState(false);
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
          addChatMatch(result.match);
        }
      });
    },
    [addChatMatch, onActionStart],
  );
  const handleContinueDiscovery = useCallback(() => {
    onMatchedProfileMatchClear();
    setIsContinuingDiscovery(true);
    void onPersonPreviewLoad().finally(() => {
      scrollDiscoveryToTop();
      setIsContinuingDiscovery(false);
    });
  }, [onMatchedProfileMatchClear, onPersonPreviewLoad]);
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

    scrollDiscoveryToTop();
  }, [personPreview]);

  const discoveryHeader = (
    <Box {...styles.stickyHeader}>
      {isDiscoveryFeedbackEnabled && <DiscoveryFeedbackBanner />}
      <DiscoveryIntroBanner />
      <DiscoveryTopPanel
        initialDiscoverySettings={initialDiscoverySettings}
        isFilterPanelOpen={isDiscoveryFilterPanelOpen}
        onDiscoveryReload={onDiscoveryReload}
        onFilterPanelOpenChange={setIsDiscoveryFilterPanelOpen}
        onDiscoverySettingsSave={onDiscoverySettingsSave}
      />
    </Box>
  );

  if (isLoadingPersonPreview && !personPreview) {
    return (
      <Box {...styles.deck}>
        <Box {...styles.stickyHeader}>
          {isDiscoveryFeedbackEnabled && <DiscoveryFeedbackBanner />}
          <DiscoveryIntroBanner />
        </Box>
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
        {isEmptyDiscovery ? (
          discoveryHeader
        ) : (
          <Box {...styles.stickyHeader}>
            {isDiscoveryFeedbackEnabled && <DiscoveryFeedbackBanner />}
            <DiscoveryIntroBanner />
          </Box>
        )}
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
          {discoveryHeader}
          <PillGroup>
            <PersonPreviewHeader
              activeAction={activeAction}
              headerDescription="Profil vybraný podľa tvojich kritérií"
              headerIcon={happySmileIcon}
              headerTitle="Človek nablízku"
              isSticky={false}
              isLoadingNextPerson={
                isSubmittingPersonPreviewAction || isContinuingDiscovery
              }
              person={personPreview}
            />
            <PersonPreviewDetail
              onPhotoClick={openPreviewPhoto}
              person={personPreview}
            />
          </PillGroup>
          <PersonPreviewActionSection
            activeAction={activeAction}
            isSubmitting={
              isSubmittingPersonPreviewAction || isContinuingDiscovery
            }
            matchId={matchedProfileMatch?.id}
            onContinueDiscovery={handleContinueDiscovery}
            onMessageClick={
              matchedProfileMatch ? handleMessageClick : undefined
            }
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
