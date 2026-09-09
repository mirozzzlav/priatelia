import { createContext, useContext } from "react";

import type { ChatMatch } from "src/services/api";

export type ChatMatchesContextValue = {
  isLoadingMatches: boolean;
  markMatchesSeen: (matchIds: string[]) => void;
  matchesError: string | null;
  matches: ChatMatch[];
  newDiscoveryMatchCount: number;
  newDiscoveryMatches: ChatMatch[];
  reloadMatches: () => Promise<ChatMatch[]>;
};

export const ChatMatchesContext =
  createContext<ChatMatchesContextValue | null>(null);

export function useChatMatches() {
  const context = useContext(ChatMatchesContext);

  if (!context) {
    throw new Error("useChatMatches must be used inside ChatMatchesProvider");
  }

  return context;
}
