import { Box, Flex, type BoxProps } from "@chakra-ui/react";

import thumbDownIcon from "assets/thumb-down.svg";
import thumbUpIcon from "assets/thumb-up.svg";
import { LoadingPill } from "src/components/LoadingPill";
import { PersonPreviewToolbar } from "src/features/person-preview/components/PersonPreviewToolbar";
import type {
  ActivePersonPreviewAction,
  PersonPreview,
} from "src/features/person-preview/types";

const styles = {
  stage: (stickyTop: BoxProps["top"]) =>
    ({
      position: "sticky",
      top: stickyTop,
      zIndex: 30,
      sx: {
        touchAction: "pan-y",
      },
    }) as const,
  identityBlock: {
    position: "relative",
    userSelect: "none",
  },
  transitionOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    align: "center",
    justify: "center",
    pointerEvents: "none",
  },
} as const;

type PersonPreviewPhotoProps = {
  activeAction: ActivePersonPreviewAction;
  isMatched?: boolean;
  isLoadingNextPerson: boolean;
  onMessageClick?: () => void;
  person: PersonPreview;
  stickyTop?: BoxProps["top"];
};

export function PersonPreviewPhoto({
  activeAction,
  isMatched = false,
  isLoadingNextPerson,
  onMessageClick,
  person,
  stickyTop = "176px",
}: PersonPreviewPhotoProps) {
  const actionIcon = activeAction === "like" ? thumbUpIcon : thumbDownIcon;

  return (
    <Box {...styles.stage(stickyTop)}>
      <Box
        as="article"
        {...styles.identityBlock}
      >
        <PersonPreviewToolbar
          isMatched={isMatched}
          onMessageClick={onMessageClick}
          person={person}
        />
      </Box>
      {isLoadingNextPerson && (
        <Flex {...styles.transitionOverlay}>
          <LoadingPill icon={actionIcon} text="Hľadám ti ďalšieho priateľa." />
        </Flex>
      )}
    </Box>
  );
}
