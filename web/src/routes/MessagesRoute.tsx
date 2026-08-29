import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MessageMatchesScreen } from "src/features/messages";
import { apiClient, type ChatMatch } from "src/services/api";

export function MessagesRoute() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<ChatMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMatches = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextMatches = await apiClient.getChatMatches();

        if (isMounted) {
          setMatches(nextMatches);
        }
      } catch {
        if (isMounted) {
          setError("Správy sa nepodarilo načítať. Skús to znova.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <MessageMatchesScreen
      error={error}
      isLoading={isLoading}
      matches={matches}
      onBack={() => navigate("/discover")}
      onMatchClick={(matchId) => navigate(`/messages/${matchId}`)}
    />
  );
}
