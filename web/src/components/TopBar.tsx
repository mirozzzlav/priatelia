import { Flex, IconButton } from "@chakra-ui/react";

import { useChatMatches } from "src/context/chatMatches";
import { MatchIconWithCount } from "src/components/top-bar/MatchIconWithCount";
import { TopBarBrand } from "src/components/top-bar/TopBarBrand";
import { TopBarProfileMenu } from "src/components/top-bar/TopBarProfileMenu";
import { topBarStyles } from "src/components/top-bar/topBarStyles";

const styles = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    align: "center",
    justify: "space-between",
    h: "64px",
    px: { base: "12px", sm: "18px" },
    bg: "app.base",
    color: "app.white",
    backdropFilter: "blur(18px)",
  },
  emptySlot: {
    boxSize: "42px",
    flexShrink: 0,
  },
  rightActions: {
    align: "center",
    gap: { base: "6px", sm: "8px" },
    position: "relative",
    zIndex: 1,
  },
  leftActions: {
    align: "center",
    gap: { base: "6px", sm: "8px" },
    minW: 0,
    position: "relative",
    zIndex: 1,
  },
  centerBrand: {
    position: "absolute",
    top: "50%",
    left: "50%",
    maxW: "calc(100% - 132px)",
    transform: "translate(calc(-50% + 8px), -50%)",
  },
} as const;

type TopBarProps = {
  isAuthenticated: boolean;
  onDiscoverClick: () => void;
  onLogout: () => void;
  onMessagesClick: () => void;
  onProfileClick: () => void;
};

export function TopBar({
  isAuthenticated,
  onDiscoverClick,
  onLogout,
  onMessagesClick,
  onProfileClick,
}: TopBarProps) {
  const {
    markMatchesSeen,
    matches,
    newDiscoveryMatchCount,
    newDiscoveryMatches,
  } = useChatMatches();
  const unreadMessageCount = matches.reduce(
    (count, match) => count + match.unreadCount,
    0,
  );
  const notificationCount = newDiscoveryMatchCount + unreadMessageCount;

  const handleMessagesClick = () => {
    markMatchesSeen(newDiscoveryMatches.map((match) => match.id));
    onMessagesClick();
  };

  return (
    <Flex as="header" {...styles.root}>
      <Flex {...styles.leftActions}>
        {isAuthenticated ? (
          <TopBarProfileMenu
            onDiscoverClick={onDiscoverClick}
            onLogout={onLogout}
            onProfileClick={onProfileClick}
          />
        ) : null}
      </Flex>

      <Flex {...styles.centerBrand}>
        <TopBarBrand />
      </Flex>

      {isAuthenticated ? (
        <Flex {...styles.rightActions}>
          <IconButton
            aria-label="Zobraziť správy a prepojenia"
            icon={
              <MatchIconWithCount
                count={notificationCount}
              />
            }
            onClick={handleMessagesClick}
            {...topBarStyles.iconButton}
          />
        </Flex>
      ) : (
        <Flex aria-hidden="true" {...styles.emptySlot} />
      )}
    </Flex>
  );
}
