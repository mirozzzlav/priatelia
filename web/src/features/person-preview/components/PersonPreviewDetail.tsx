import { Box, Image, SimpleGrid, Text } from "@chakra-ui/react";

import { InterestTagList } from "src/components/InterestTagList";
import { DetailSection } from "src/features/person-preview/components/DetailSection";
import type { PersonPreview } from "src/features/person-preview/types";

const styles = {
  root: {
    px: "0",
  },
  bio: {
    color: "app.text",
    fontSize: "md",
    lineHeight: 1.55,
  },
  photoGrid: {
    columns: 2,
    gap: "10px",
  },
  photo: (index: number) =>
    ({
      gridColumn: index === 0 ? "span 2" : undefined,
      w: "100%",
      aspectRatio: index === 0 ? "16 / 10" : "1",
      cursor: "zoom-in",
      objectFit: "cover",
      borderRadius: "18px",
    }) as const,
} as const;

type PersonPreviewDetailProps = {
  onPhotoClick: (photoSrc: string) => void;
  person: PersonPreview;
};

export function PersonPreviewDetail({
  onPhotoClick,
  person,
}: PersonPreviewDetailProps) {
  const galleryPhotos = [
    { alt: `${person.name}, hlavná profilová fotka`, src: person.photo },
    ...person.photos
      .map((src, index) => ({
        alt: `${person.name}, fotka ${index + 1}`,
        src,
      }))
      .filter((photo) => photo.src !== person.photo),
  ];

  return (
    <Box {...styles.root}>
      <DetailSection title="Kto som">
        <Text {...styles.bio}>{person.bio}</Text>
      </DetailSection>

      {person.lookingFor?.trim() && (
        <DetailSection title="Čo hľadám">
          <Text {...styles.bio}>{person.lookingFor}</Text>
        </DetailSection>
      )}

      <DetailSection title="Čo ma zaujíma">
        <InterestTagList tags={person.tags} />
      </DetailSection>

      <DetailSection title="Moje fotky">
        <SimpleGrid {...styles.photoGrid}>
          {galleryPhotos.map((photo, gridIndex) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              onClick={() => onPhotoClick(photo.src)}
              {...styles.photo(gridIndex)}
            />
          ))}
        </SimpleGrid>
      </DetailSection>
    </Box>
  );
}
