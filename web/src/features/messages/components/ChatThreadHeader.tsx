import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { BackButton } from "src/components/formElements";
import { PageHeader } from "src/components/PageHeader";
import type { ChatMatch } from "src/services/api";

type ChatThreadHeaderProps = {
  match: ChatMatch | null;
  onBack: () => void;
};

const styles = {
  root: {
    alignItems: "center",
    flexShrink: 0,
  },
  backButton: {
    alignSelf: "start",
    flexShrink: 0,
    justifySelf: "end",
    h: "34px",
    minW: "0",
    px: "10px",
    fontSize: "xs",
    iconSpacing: "5px",
  },
  profileHeader: {
    alignItems: "center",
    gap: "12px",
    minW: 0,
  },
  photo: {
    boxSize: "46px",
    flexShrink: 0,
    borderRadius: "12px",
    objectFit: "cover",
  },
  titleWrap: {
    minW: 0,
  },
  title: {
    color: "app.text",
    fontSize: "xl",
    lineHeight: 1.1,
    letterSpacing: 0,
  },
  meta: {
    mt: "3px",
    color: "app.text",
    fontSize: "xs",
    fontWeight: "bold",
  },
} as const;

export function ChatThreadHeader({ match, onBack }: ChatThreadHeaderProps) {
  return (
    <PageHeader
      leadingContent={
        match && (
          <Flex {...styles.profileHeader}>
            <Image src={match.photo} alt={match.name} {...styles.photo} />
            <Box {...styles.titleWrap}>
              <Heading as="h1" {...styles.title}>
                {match.name}
              </Heading>
              <Text {...styles.meta}>
                {match.age} · {match.location}
              </Text>
            </Box>
          </Flex>
        )
      }
      rightAction={<BackButton onClick={onBack} {...styles.backButton} />}
      {...styles.root}
    />
  );
}
