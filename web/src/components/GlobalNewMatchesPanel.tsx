import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { toggleDiscoveryMatchesEvent } from "src/components/TopBar";
import { HeaderSurface } from "src/components/HeaderSurface";
import { useChatMatches } from "src/context/chatMatches";
import { DiscoveryMatchesPanel } from "src/features/discovery/components/DiscoveryMatchesPanel";
import type { ChatMatch } from "src/services/api";

const recentDiscoveryMatchLimit = 8;

const styles = {
  panel: {
    position: "fixed",
    top: "64px",
    left: "50%",
    zIndex: 35,
    w: "min(100%, 460px)",
    h: "calc(100dvh - 64px)",
    bg: "rgba(255, 255, 255, 0.78)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    overflowY: "auto",
    transform: "translateX(-50%)",
  },
  content: {
    px: { base: "12px", sm: "16px" },
    py: "22px",
  },
} as const;

function getNewDiscoveryMatches(matches: ChatMatch[]) {
  return matches.filter((match) => match.isNew && !match.lastMessage);
}

function getRecentDiscoveryMatches(matches: ChatMatch[]) {
  return matches
    .filter((match) => !match.lastMessage)
    .slice(0, recentDiscoveryMatchLimit);
}

export function GlobalNewMatchesPanel() {
  const navigate = useNavigate();
  const {
    isLoadingMatches,
    markMatchesSeen,
    newDiscoveryMatches,
    recentDiscoveryMatches,
    reloadMatches,
  } = useChatMatches();
  const [isOpen, setIsOpen] = useState(false);
  const [panelMatches, setPanelMatches] = useState<ChatMatch[]>([]);
  const [panelTitle, setPanelTitle] = useState("Nové prepojenia");
  const displayedMatches = useMemo(
    () => (panelMatches.length > 0 ? panelMatches : recentDiscoveryMatches),
    [panelMatches, recentDiscoveryMatches],
  );

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setPanelMatches([]);
    setPanelTitle("Nové prepojenia");
  }, []);

  const openPanel = useCallback(async () => {
    if (isOpen) {
      closePanel();
      return;
    }

    const latestMatches = await reloadMatches();
    const latestNewMatches = getNewDiscoveryMatches(latestMatches);
    const latestRecentMatches = getRecentDiscoveryMatches(latestMatches);
    const hasLatestNewMatches = latestNewMatches.length > 0;
    const hasCachedNewMatches = newDiscoveryMatches.length > 0;
    const nextPanelMatches = hasLatestNewMatches
      ? latestNewMatches
      : latestRecentMatches.length > 0
        ? latestRecentMatches
        : hasCachedNewMatches
          ? newDiscoveryMatches
          : recentDiscoveryMatches;

    if (nextPanelMatches.length === 0) {
      return;
    }

    setPanelMatches(nextPanelMatches);
    setPanelTitle(
      hasLatestNewMatches || hasCachedNewMatches
        ? "Nové prepojenia"
        : "Posledné prepojenia",
    );
    setIsOpen(true);
    markMatchesSeen(
      nextPanelMatches
        .filter((match) => match.isNew)
        .map((match) => match.id),
    );
  }, [
    closePanel,
    isOpen,
    markMatchesSeen,
    newDiscoveryMatches,
    recentDiscoveryMatches,
    reloadMatches,
  ]);

  useEffect(() => {
    const handleToggleMatches = () => {
      void openPanel();
    };

    window.addEventListener(toggleDiscoveryMatchesEvent, handleToggleMatches);

    return () => {
      window.removeEventListener(
        toggleDiscoveryMatchesEvent,
        handleToggleMatches,
      );
    };
  }, [openPanel]);

  if (!isOpen) {
    return null;
  }

  return (
    <HeaderSurface isExpanded {...styles.panel}>
      <Box {...styles.content}>
        <DiscoveryMatchesPanel
          isLoading={isLoadingMatches}
          matches={displayedMatches}
          title={panelTitle}
          onMatchClick={(matchId) => {
            closePanel();
            navigate(`/messages/${matchId}`);
          }}
        />
      </Box>
    </HeaderSurface>
  );
}
