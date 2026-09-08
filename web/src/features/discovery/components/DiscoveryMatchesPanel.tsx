import { Text, VStack } from "@chakra-ui/react";

import { PanelHeading } from "src/components/PanelHeading";
import { ChatMatchList } from "src/features/messages";
import type { ChatMatch } from "src/services/api";

type DiscoveryMatchesPanelProps = {
  isLoading: boolean;
  matches: ChatMatch[];
  title?: string;
  onMatchClick: (matchId: string) => void;
};

const styles = {
  infoContent: {
    align: "stretch",
    spacing: "18px",
  },
  infoBody: {
    color: "app.text",
    fontSize: "md",
    lineHeight: 1.55,
  },
} as const;

export function DiscoveryMatchesPanel({
  isLoading,
  matches,
  title = "Nové prepojenia",
  onMatchClick,
}: DiscoveryMatchesPanelProps) {
  if (isLoading) {
    return <Text {...styles.infoBody}>Načítavam nové prepojenia.</Text>;
  }

  if (matches.length === 0) {
    return <Text {...styles.infoBody}>Zatiaľ nemáš žiadne prepojenia.</Text>;
  }

  return (
    <VStack {...styles.infoContent}>
      <PanelHeading>{title}</PanelHeading>
      <ChatMatchList matches={matches} onMatchClick={onMatchClick} />
    </VStack>
  );
}
