import { Flex } from "@chakra-ui/react";

import interestIcon from "assets/interest.svg";
import type { InterestTag } from "src/features/interests/types";
import { ProfileMetaTag } from "src/components/ProfileMetaTag";

const styles = {
  list: {
    flexWrap: "wrap",
    gap: "7px",
  },
} as const;

type InterestTagListProps = {
  onRemove?: (interestId: string) => void;
  tags: InterestTag[];
};

export function InterestTagList({ onRemove, tags }: InterestTagListProps) {
  return (
    <Flex {...styles.list}>
      {tags.map((tag) => (
        <ProfileMetaTag
          key={tag.id}
          icon={interestIcon}
          onRemove={onRemove ? () => onRemove(tag.id) : undefined}
          removeLabel={`Odstrániť záujem ${tag.name}`}
          type="special"
        >
          {tag.name}
        </ProfileMetaTag>
      ))}
    </Flex>
  );
}
