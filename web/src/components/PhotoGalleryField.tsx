import { useRef, useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  SimpleGrid,
  VisuallyHidden,
} from "@chakra-ui/react";

import {
  FormToggleButton,
  RequiredFieldLabel,
} from "src/components/formElements";
import personIcon from "assets/person.svg";
import { SvgImage } from "src/components/SvgImage";
import { PhotoViewer } from "src/components/PhotoViewer";

type PhotoGalleryItem = {
  id: string;
  isPrimary: boolean;
  name: string;
  url: string;
};

type PhotoGalleryFieldProps = {
  error?: string;
  isInvalid: boolean;
  onPhotoUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (photoId: string) => void;
  onSetPrimaryPhoto: (photoId: string) => void;
  photos: PhotoGalleryItem[];
};

const styles = {
  section: {
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.18)",
    borderRadius: "18px",
    bg: "rgba(53, 87, 45, 0.035)",
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 7px 18px rgba(53, 87, 45, 0.08)",
    p: "14px",
  },
  uploadButton: {
    w: "max-content",
    minW: 0,
    mt: "12px",
    cursor: "pointer",
  },
  photoGrid: {
    gridTemplateColumns: "repeat(2, minmax(0, 34%))",
    gap: "10px",
    justifyContent: "start",
  },
  photoCard: {
    position: "relative",
    overflow: "hidden",
    border: "2px solid",
    borderColor: "rgba(53, 87, 45, 0.12)",
    borderRadius: "14px",
    bg: "rgba(53, 87, 45, 0.04)",
  },
  primaryPhotoCard: {
    borderColor: "app.info",
  },
  photo: {
    w: "100%",
    aspectRatio: "1",
    cursor: "zoom-in",
    objectFit: "cover",
  },
  photoActions: {
    align: "stretch",
    flexDirection: "column",
    gap: "6px",
    p: "8px",
    bg: "app.white",
  },
  smallButton: {
    h: "32px",
    minW: 0,
    w: "100%",
    px: "7px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "extrabold",
    _disabled: {
      cursor: "not-allowed",
      opacity: 1,
    },
  },
} as const;

export function PhotoGalleryField({
  error,
  isInvalid,
  onPhotoUpload,
  onRemovePhoto,
  onSetPrimaryPhoto,
  photos,
}: PhotoGalleryFieldProps) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  const closeViewer = () => {
    setSelectedPhotoIndex(null);
  };

  return (
    <FormControl isInvalid={isInvalid}>
      <RequiredFieldLabel>Fotky do galérie</RequiredFieldLabel>
      <Box {...styles.section}>
        {photos.length > 0 && (
          <SimpleGrid {...styles.photoGrid}>
            {photos.map((photo, index) => (
              <Box
                key={photo.id}
                {...styles.photoCard}
                {...(photo.isPrimary ? styles.primaryPhotoCard : {})}
              >
                <Image
                  src={photo.url}
                  alt={photo.name}
                  onClick={() => setSelectedPhotoIndex(index)}
                  {...styles.photo}
                />
                <Flex {...styles.photoActions}>
                  <FormToggleButton
                    aria-pressed={photo.isPrimary}
                    colorVariant="orange"
                    isDisabled={photo.isPrimary}
                    isSelected={photo.isPrimary}
                    icon={
                      <SvgImage
                        src={personIcon}
                        boxSize="100%"
                        filter={
                          photo.isPrimary ? "brightness(0) invert(1)" : undefined
                        }
                      />
                    }
                    onClick={() => onSetPrimaryPhoto(photo.id)}
                    size="sm"
                    {...styles.smallButton}
                  >
                    Profilová
                  </FormToggleButton>
                  <Button
                    type="button"
                    onClick={() => onRemovePhoto(photo.id)}
                    variant="ghost"
                    {...styles.smallButton}
                    _hover={{ bg: "rgba(53, 87, 45, 0.06)" }}
                    _active={{ bg: "rgba(53, 87, 45, 0.1)" }}
                  >
                    Zmazať
                  </Button>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}

        <FormToggleButton
          isSelected
          type="button"
          onClick={() => photoInputRef.current?.click()}
          {...styles.uploadButton}
        >
          Nahrať fotky
          <VisuallyHidden>
            <Input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onPhotoUpload}
            />
          </VisuallyHidden>
        </FormToggleButton>
        <FormErrorMessage color="app.error">{error}</FormErrorMessage>
      </Box>

      <PhotoViewer
        initialIndex={selectedPhotoIndex}
        isOpen={selectedPhotoIndex !== null}
        onClose={closeViewer}
        onIndexChange={setSelectedPhotoIndex}
        photos={photos.map((photo) => ({
          alt: photo.name,
          src: photo.url,
        }))}
      />
    </FormControl>
  );
}
