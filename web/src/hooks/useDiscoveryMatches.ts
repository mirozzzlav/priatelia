import { useCallback, useEffect, useState } from "react";

import { apiClient, type ChatMatch } from "src/services/api";

export function useDiscoveryMatches() {
  const [matches, setMatches] = useState<ChatMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);

  const loadMatches = useCallback(async () => {
    try {
      const nextMatches = await apiClient.getChatMatches();
      setMatches(nextMatches);
    } catch {
      setMatches([]);
    }
  }, []);

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
        void loadMatches();
      });
    },
    [loadMatches],
  );

  useEffect(() => {
    let isMounted = true;

    apiClient
      .getChatMatches()
      .then((nextMatches) => {
        if (isMounted) {
          setMatches(nextMatches);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMatches([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingMatches(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadMatches();
    }, 20_000);

    return () => window.clearInterval(intervalId);
  }, [loadMatches]);

  return {
    isLoadingMatches,
    loadMatches,
    markMatchesSeen,
    matches,
  };
}
