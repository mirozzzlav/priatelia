import { Flex, Text } from "@chakra-ui/react";

import { SecondaryButton } from "src/components/formElements";
import { ScreenLayout } from "src/components/layouts";
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
    mt: "18px",
    h: "42px",
    px: "12px",
    borderRadius: "12px",
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
    <ScreenLayout
      title="Správy"
      intro="Vyber si človeka, s ktorým ste si dali vzájomné áno."
    >
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

      <SecondaryButton onClick={onBack} {...styles.backButton}>
        Späť
      </SecondaryButton>
    </ScreenLayout>
  );
}
