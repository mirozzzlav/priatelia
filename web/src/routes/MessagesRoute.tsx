import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useChatMatches } from "src/context/chatMatches";
import { MessageMatchesScreen } from "src/features/messages";
import type { ChatMatch } from "src/services/api";

function getConversationSortTime(match: ChatMatch) {
  return match.lastMessageAt ? new Date(match.lastMessageAt).getTime() : 0;
}

function getSortedConversationMatches(matches: ChatMatch[]) {
  return matches
    .map((match, index) => ({ index, match }))
    .sort((left, right) => {
      const leftIsNewConversation = !left.match.lastMessage;
      const rightIsNewConversation = !right.match.lastMessage;

      if (leftIsNewConversation !== rightIsNewConversation) {
        return leftIsNewConversation ? -1 : 1;
      }

      return (
        getConversationSortTime(right.match) -
          getConversationSortTime(left.match) || left.index - right.index
      );
    })
    .map(({ match }) => match);
}

export function MessagesRoute() {
  const navigate = useNavigate();
  const { isLoadingMatches, matches, matchesError } = useChatMatches();
  const sortedMatches = useMemo(
    () => getSortedConversationMatches(matches),
    [matches],
  );

  return (
    <MessageMatchesScreen
      error={matchesError}
      isLoading={isLoadingMatches}
      matches={sortedMatches}
      onBack={() => navigate("/discover")}
      onMatchClick={(matchId) => navigate(`/messages/${matchId}`)}
      onProfileClick={(matchId) =>
        navigate(`/people/${matchId}`, { state: { from: "/messages" } })
      }
    />
  );
}
