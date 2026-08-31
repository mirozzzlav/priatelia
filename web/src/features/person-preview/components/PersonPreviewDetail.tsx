import { Box, Image, SimpleGrid, Text } from "@chakra-ui/react";

import { InterestTagList } from "src/components/InterestTagList";
import { DetailSection } from "src/features/person-preview/components/DetailSection";
import type { PersonPreview } from "src/features/person-preview/types";

const styles = {
  root: {
    mt: "12px",
    px: "2px",
    pb: "44px",
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
      objectFit: "cover",
      borderRadius: "18px",
    }) as const,
} as const;

type PersonPreviewDetailProps = {
  person: PersonPreview;
};

export function PersonPreviewDetail({ person }: PersonPreviewDetailProps) {
  const additionalPhotos = person.photos.filter((src) => src !== person.photo);

  return (
    <Box {...styles.root}>
      <DetailSection title="Bio">
        <Text {...styles.bio}>{person.bio}</Text>
      </DetailSection>

      {additionalPhotos.length > 0 && (
        <DetailSection title="Ďalšie fotky">
          <SimpleGrid {...styles.photoGrid}>
            {additionalPhotos.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`${person.name}, fotka ${index + 2}`}
                {...styles.photo(index)}
              />
            ))}
          </SimpleGrid>
        </DetailSection>
      )}

      <DetailSection title="Záujmy">
        <InterestTagList tags={person.tags} />
      </DetailSection>
    </Box>
  );
}
