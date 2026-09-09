import { useEffect, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { BackButton } from "src/components/formElements";
import { HeaderSurface } from "src/components/HeaderSurface";
import { CenteredStatusLayout } from "src/components/layouts";
import { LoadingPill } from "src/components/LoadingPill";
import { PhotoViewer } from "src/components/PhotoViewer";
import { InfoScreen } from "src/features/info";
import {
  PersonPreviewDetail,
  PersonPreviewPhoto,
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
    zIndex: 20,
  },
  headerContent: {
    justify: "flex-end",
  },
  backButton: {
    alignSelf: "start",
    justifySelf: "end",
    h: "34px",
    minW: "0",
    px: "10px",
    fontSize: "xs",
    iconSpacing: "5px",
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
      <HeaderSurface {...styles.header}>
        <Flex {...styles.headerContent}>
          <BackButton
            onClick={() => navigate(returnPath)}
            {...styles.backButton}
          />
        </Flex>
      </HeaderSurface>

      {person && (
        <>
          <Flex direction="column">
            <PersonPreviewPhoto
              activeAction={null}
              isLoadingNextPerson={false}
              person={person}
              showDecisionBadges={false}
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
          </Flex>
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
