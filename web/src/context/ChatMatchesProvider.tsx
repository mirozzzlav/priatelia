import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ChatMatchesContext,
  type ChatMatchesContextValue,
} from "src/context/chatMatches";
import { useAuth } from "src/context/auth";
import { apiClient, type ChatMatch } from "src/services/api";

type ChatMatchesProviderProps = {
  children: ReactNode;
};

const emptyMatches: ChatMatch[] = [];

export function ChatMatchesProvider({ children }: ChatMatchesProviderProps) {
  const { isAuthenticated } = useAuth();
  const [matches, setMatches] = useState<ChatMatch[]>([]);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  const reloadMatches = useCallback(async () => {
    if (!isAuthenticated) {
      return [];
    }

    try {
      const nextMatches = await apiClient.getChatMatches();
      setMatches(nextMatches);
      setMatchesError(null);
      return nextMatches;
    } catch {
      setMatches([]);
      setMatchesError("Správy sa nepodarilo načítať. Skús to znova.");
      return [];
    }
  }, [isAuthenticated]);

  const markMatchesSeen = useCallback(
    (matchIds: string[]) => {
      if (matchIds.length === 0) {
        return;
      }

      const seenMatchIds = new Set(matchIds);
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          seenMatchIds.has(match.id) ? { ...match, isNew: false } : match,
        ),
      );

      apiClient.markChatMatchesSeen(matchIds).catch(() => {
        void reloadMatches();
      });
    },
    [reloadMatches],
  );

  const markMatchMessagesRead = useCallback((matchId: string) => {
    setMatches((currentMatches) =>
      currentMatches.map((match) =>
        match.id === matchId ? { ...match, unreadCount: 0 } : match,
      ),
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    const loadInitialMatches = async () => {
      setIsLoadingMatches(true);

      try {
        await reloadMatches();
      } finally {
        if (isMounted) {
          setIsLoadingMatches(false);
        }
      }
    };

    void loadInitialMatches();
    const intervalId = window.setInterval(() => {
      void reloadMatches();
    }, 20_000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, reloadMatches]);

  const visibleMatches = useMemo(
    () => (isAuthenticated ? matches : emptyMatches),
    [isAuthenticated, matches],
  );
  const newDiscoveryMatches = useMemo(
    () => visibleMatches.filter((match) => match.isNew && !match.lastMessage),
    [visibleMatches],
  );

  const value = useMemo<ChatMatchesContextValue>(
    () => ({
      isLoadingMatches: isAuthenticated ? isLoadingMatches : false,
      markMatchMessagesRead,
      markMatchesSeen,
      matchesError: isAuthenticated ? matchesError : null,
      matches: visibleMatches,
      newDiscoveryMatchCount: newDiscoveryMatches.length,
      newDiscoveryMatches,
      reloadMatches,
    }),
    [
      isAuthenticated,
      isLoadingMatches,
      markMatchMessagesRead,
      markMatchesSeen,
      matchesError,
      newDiscoveryMatches,
      reloadMatches,
      visibleMatches,
    ],
  );

  return (
    <ChatMatchesContext.Provider value={value}>
      {children}
    </ChatMatchesContext.Provider>
  );
}
