import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { BackButton } from "src/components/formElements";
import { PageHeader } from "src/components/PageHeader";
import type { ChatMatch } from "src/services/api";

type ChatThreadHeaderProps = {
  match: ChatMatch | null;
  onBack: () => void;
  onProfileClick: (matchId: string) => void;
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
    maxW: "100%",
    minW: 0,
  },
  photo: {
    boxSize: "46px",
    flexShrink: 0,
    borderRadius: "12px",
    objectFit: "cover",
  },
  photoButton: {
    h: "46px",
    minW: "46px",
    p: 0,
    borderRadius: "12px",
    overflow: "hidden",
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.3)",
    },
  },
  titleWrap: {
    flex: "1 1 0",
    minW: 0,
  },
  titleButton: {
    h: "auto",
    minW: 0,
    maxW: "100%",
    p: 0,
    textAlign: "left",
    _hover: {
      color: "app.baseDark",
      textDecoration: "underline",
    },
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
    },
  },
  title: {
    color: "app.text",
    fontSize: "xl",
    lineHeight: 1.1,
    letterSpacing: 0,
    noOfLines: 1,
  },
  meta: {
    mt: "3px",
    color: "app.text",
    fontSize: "xs",
    fontWeight: "bold",
    noOfLines: 1,
  },
} as const;

export function ChatThreadHeader({
  match,
  onBack,
  onProfileClick,
}: ChatThreadHeaderProps) {
  return (
    <PageHeader
      leadingContent={
        match && (
          <Flex {...styles.profileHeader}>
            <Button
              aria-label={`Otvoriť profil: ${match.name}`}
              onClick={() => onProfileClick(match.id)}
              type="button"
              variant="unstyled"
              {...styles.photoButton}
            >
              <Image src={match.photo} alt={match.name} {...styles.photo} />
            </Button>
            <Box {...styles.titleWrap}>
              <Button
                onClick={() => onProfileClick(match.id)}
                type="button"
                variant="unstyled"
                {...styles.titleButton}
              >
                <Heading as="h1" {...styles.title}>
                  {match.name}
                </Heading>
              </Button>
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
