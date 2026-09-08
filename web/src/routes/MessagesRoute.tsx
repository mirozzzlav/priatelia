import { useNavigate } from "react-router-dom";

import { useChatMatches } from "src/context/chatMatches";
import { MessageMatchesScreen } from "src/features/messages";

export function MessagesRoute() {
  const navigate = useNavigate();
  const { isLoadingMatches, matches, matchesError } = useChatMatches();

  return (
    <MessageMatchesScreen
      error={matchesError}
      isLoading={isLoadingMatches}
      matches={matches}
      onBack={() => navigate("/discover")}
      onMatchClick={(matchId) => navigate(`/messages/${matchId}`)}
    />
  );
}
