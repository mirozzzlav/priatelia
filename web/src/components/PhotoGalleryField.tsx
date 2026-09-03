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
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";

import { RequiredFieldLabel } from "src/components/formElements";
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
  uploadButton: {
    h: "48px",
    border: "1px solid",
    borderColor: "app.base",
    borderRadius: "12px",
    bg: "app.base",
    color: "app.white",
    cursor: "pointer",
    _hover: { bg: "app.baseDark" },
    _active: { bg: "app.baseDark" },
  },
  photoGrid: {
    columns: 2,
    gap: "10px",
    mt: "12px",
  },
  photoCard: {
    position: "relative",
    overflow: "hidden",
    border: "2px solid",
    borderColor: "app.bgAux",
    borderRadius: "14px",
    bg: "app.bgAux",
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
    align: "center",
    justify: "space-between",
    gap: "8px",
    p: "8px",
    bg: "app.white",
  },
  primaryBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    px: "8px",
    py: "4px",
    borderRadius: "999px",
    bg: "app.info",
    color: "app.text",
    fontSize: "xs",
    fontWeight: "black",
  },
  smallButton: {
    h: "32px",
    px: "9px",
    borderRadius: "8px",
    fontSize: "xs",
    fontWeight: "extrabold",
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
      <Button
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
      </Button>
      <FormErrorMessage color="app.error">{error}</FormErrorMessage>

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
              {photo.isPrimary && <Text {...styles.primaryBadge}>Hlavná</Text>}
              <Flex {...styles.photoActions}>
                <Button
                  type="button"
                  onClick={() => onSetPrimaryPhoto(photo.id)}
                  isDisabled={photo.isPrimary}
                  {...styles.smallButton}
                >
                  Nastaviť
                </Button>
                <Button
                  type="button"
                  onClick={() => onRemovePhoto(photo.id)}
                  variant="ghost"
                  {...styles.smallButton}
                >
                  Zmazať
                </Button>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}

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
