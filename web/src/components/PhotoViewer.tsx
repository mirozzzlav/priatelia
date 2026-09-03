import { useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export type PhotoViewerItem = {
  alt: string;
  src: string;
};

type PhotoViewerProps = {
  initialIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  photos: PhotoViewerItem[];
};

const styles = {
  content: {
    w: "100vw",
    maxW: "100vw",
    h: "100vh",
    m: 0,
    borderRadius: 0,
    bg: "rgba(0, 0, 0, 0.92)",
    boxShadow: "none",
  },
  body: {
    position: "relative",
    w: "100%",
    h: "100%",
    overflow: "hidden",
  },
  image: {
    maxW: "100vw",
    maxH: "100vh",
    objectFit: "contain",
  },
  button: {
    position: "absolute",
    zIndex: 2,
    display: "grid",
    placeItems: "center",
    boxSize: "44px",
    minW: "44px",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.92)",
    color: "app.base",
    fontSize: "26px",
    fontWeight: "normal",
    lineHeight: 1,
    _hover: { bg: "app.white" },
    _active: { bg: "app.white" },
  },
  closeButton: {
    top: "18px",
    right: "18px",
  },
  previousButton: {
    left: { base: "12px", md: "24px" },
    top: "50%",
    transform: "translateY(-50%)",
  },
  nextButton: {
    right: { base: "12px", md: "24px" },
    top: "50%",
    transform: "translateY(-50%)",
  },
  counter: {
    position: "absolute",
    left: "50%",
    bottom: "18px",
    zIndex: 2,
    px: "12px",
    py: "7px",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.92)",
    color: "app.base",
    fontSize: "sm",
    fontWeight: "extrabold",
    transform: "translateX(-50%)",
  },
} as const;

export function PhotoViewer({
  initialIndex,
  isOpen,
  onClose,
  onIndexChange,
  photos,
}: PhotoViewerProps) {
  const selectedPhoto =
    initialIndex === null ? null : photos[initialIndex] ?? null;
  const hasMultiplePhotos = photos.length > 1;

  const showPreviousPhoto = useCallback(() => {
    if (initialIndex === null || photos.length === 0) {
      return;
    }

    onIndexChange(initialIndex === 0 ? photos.length - 1 : initialIndex - 1);
  }, [initialIndex, onIndexChange, photos.length]);

  const showNextPhoto = useCallback(() => {
    if (initialIndex === null || photos.length === 0) {
      return;
    }

    onIndexChange(initialIndex === photos.length - 1 ? 0 : initialIndex + 1);
  }, [initialIndex, onIndexChange, photos.length]);

  useEffect(() => {
    if (!isOpen || !hasMultiplePhotos) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultiplePhotos, isOpen, showNextPhoto, showPreviousPhoto]);

  return (
    <Modal isOpen={isOpen && selectedPhoto !== null} onClose={onClose} size="full">
      <ModalOverlay bg="rgba(0, 0, 0, 0.84)" />
      <ModalContent {...styles.content}>
        <Box {...styles.body}>
          <Button
            type="button"
            aria-label="Zavrieť prezeranie fotiek"
            onClick={onClose}
            {...styles.button}
            {...styles.closeButton}
          >
            ×
          </Button>

          {hasMultiplePhotos && (
            <Button
              type="button"
              aria-label="Predchádzajúca fotka"
              onClick={showPreviousPhoto}
              {...styles.button}
              {...styles.previousButton}
            >
              ‹
            </Button>
          )}

          <Center w="100%" h="100%">
            {selectedPhoto && (
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                {...styles.image}
              />
            )}
          </Center>

          {hasMultiplePhotos && (
            <Button
              type="button"
              aria-label="Ďalšia fotka"
              onClick={showNextPhoto}
              {...styles.button}
              {...styles.nextButton}
            >
              ›
            </Button>
          )}

          {initialIndex !== null && (
            <Text {...styles.counter}>
              {initialIndex + 1} / {photos.length}
            </Text>
          )}
        </Box>
      </ModalContent>
    </Modal>
  );
}
