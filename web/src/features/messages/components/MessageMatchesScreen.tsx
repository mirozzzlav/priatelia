import { Box, Flex, Text } from "@chakra-ui/react";

import { HeaderSurface } from "src/components/HeaderSurface";
import { PanelHeading } from "src/components/PanelHeading";
import { BackIcon, SecondaryButton } from "src/components/formElements";
import { LoadingPill } from "src/components/LoadingPill";
import { ChatMatchList } from "src/features/messages/components/ChatMatchList";
import type { ChatMatch } from "src/services/api";

type MessageMatchesScreenProps = {
  error: string | null;
  isLoading: boolean;
  matches: ChatMatch[];
  onBack: () => void;
  onMatchClick: (matchId: string) => void;
};

const styles = {
  root: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "34px",
  },
  header: {
    position: "sticky",
    top: "64px",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "start",
    gap: "12px",
  },
  titleWrap: {
    minW: 0,
  },
  content: {
    pt: { base: "22px", sm: "28px" },
  },
  intro: {
    mt: "6px",
    color: "app.text",
    fontSize: "sm",
    lineHeight: 1.35,
  },
  status: {
    py: "34px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "extrabold",
    textAlign: "center",
  },
  loadingStatus: {
    justify: "center",
    py: "34px",
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

export function MessageMatchesScreen({
  error,
  isLoading,
  matches,
  onBack,
  onMatchClick,
}: MessageMatchesScreenProps) {
  return (
    <Box {...styles.root}>
      <HeaderSurface {...styles.header}>
        <Box {...styles.titleWrap}>
          <PanelHeading as="h1" variant="main">
            Správy
          </PanelHeading>
          <Text {...styles.intro}>
            Vyber si človeka, s ktorým ste si dali vzájomné áno.
          </Text>
        </Box>
        <SecondaryButton
          leftIcon={<BackIcon />}
          onClick={onBack}
          {...styles.backButton}
        >
          Späť
        </SecondaryButton>
      </HeaderSurface>

      <Box {...styles.content}>
        {isLoading && (
          <Flex {...styles.loadingStatus}>
            <LoadingPill text="Načítavam správy." />
          </Flex>
        )}
        {error && <Text {...styles.status}>{error}</Text>}
        {!isLoading && !error && matches.length === 0 && (
          <Text {...styles.status}>Zatiaľ nemáš žiadne vzájomné zhody.</Text>
        )}

        {!isLoading && !error && matches.length > 0 && (
          <ChatMatchList matches={matches} onMatchClick={onMatchClick} />
        )}
      </Box>
    </Box>
  );
}
