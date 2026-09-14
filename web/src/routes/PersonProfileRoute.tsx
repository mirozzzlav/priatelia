import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { PageHeader } from "src/components/PageHeader";
import { PhotoViewer } from "src/components/PhotoViewer";
import { PillGroup } from "src/components/PillGroup";
import { InfoScreen } from "src/features/info";
import {
  PersonPreviewActionSection,
  PersonPreviewDetail,
  PersonPreviewHeader,
  type PersonPreview,
} from "src/features/person-preview";
import { apiClient } from "src/services/api";

type PersonProfileLocationState = {
  from?: string;
};

const styles = {
  root: {
    minH: "calc(100dvh - 64px)",
    display: "flex",
    flexDirection: "column",
    px: { base: "12px", sm: "16px" },
    pb: "22px",
  },
  header: {
    position: "sticky",
    top: "64px",
    zIndex: 40,
  },
} as const;

export function PersonProfileRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId } = useParams<{ matchId: string }>();
  const [person, setPerson] = useState<PersonPreview | null>(null);
  const [loadedMatchId, setLoadedMatchId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const locationState = location.state as PersonProfileLocationState | null;
  const returnPath = locationState?.from ?? "/messages";
  const photos = useMemo(() => {
    if (!person) {
      return [];
    }

    return Array.from(new Set([person.photo, ...person.photos])).map(
      (src, index) => ({
        alt: `${person.name}, fotka ${index + 1}`,
        src,
      }),
    );
  }, [person]);

  useEffect(() => {
    if (!matchId) {
      return;
    }

    let isActive = true;

    apiClient
      .getChatMatchProfile(matchId)
      .then((profile) => {
        if (isActive) {
          setPerson(profile);
          setLoadedMatchId(matchId);
          setHasError(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setLoadedMatchId(matchId);
          setHasError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [matchId]);

  useLayoutEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [matchId]);

  if (!matchId) {
    return <Navigate to="/messages" replace />;
  }

  const isLoading = loadedMatchId !== matchId;

  if (isLoading && !person) {
    return (
      <CenteredStatusLayout minH="calc(100vh - 64px)">
        <LoadingPill text="Načítavam profil." />
      </CenteredStatusLayout>
    );
  }

  if (hasError && !person) {
    return (
      <InfoScreen
        message="Profil sa nepodarilo načítať. Skús to znova neskôr."
        title="Profil nie je dostupný"
        variant="error"
      />
    );
  }

  return (
    <Box {...styles.root}>
      <PageHeader
        intro="Detail človeka, s ktorým ste si dali vzájomné áno."
        onBack={() => navigate(returnPath)}
        title="Profil priateľa"
        {...styles.header}
      />

      {person && (
        <>
          <PillGroup>
            <PersonPreviewHeader
              activeAction={null}
              isSticky={false}
              isLoadingNextPerson={false}
              person={person}
            />
            <PersonPreviewDetail
              onPhotoClick={(photoSrc) => {
                const photoIndex = photos.findIndex(
                  (photo) => photo.src === photoSrc,
                );
                setSelectedPhotoIndex(photoIndex >= 0 ? photoIndex : 0);
              }}
              person={person}
            />
          </PillGroup>
          <PersonPreviewActionSection
            activeAction={null}
            isSubmitting={false}
            matchId={matchId}
            onMessageClick={() => navigate(`/messages/${matchId}`)}
            onActionEnd={() => undefined}
            onActionStart={() => undefined}
          />
          <PhotoViewer
            initialIndex={selectedPhotoIndex}
            isOpen={selectedPhotoIndex !== null}
            onClose={() => setSelectedPhotoIndex(null)}
            onIndexChange={setSelectedPhotoIndex}
            photos={photos}
          />
        </>
      )}
    </Box>
  );
}
