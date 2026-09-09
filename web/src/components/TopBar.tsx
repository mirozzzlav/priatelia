import { Flex, IconButton } from "@chakra-ui/react";

import { useChatMatches } from "src/context/chatMatches";
import { HeartIconWithCount } from "src/components/top-bar/HeartIconWithCount";
import { MessageIconWithCount } from "src/components/top-bar/MessageIconWithCount";
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
} as const;

type TopBarProps = {
  isAuthenticated: boolean;
  onConnectionsClick: () => void;
  onDiscoverClick: () => void;
  onLogout: () => void;
  onMessagesClick: () => void;
  onProfileClick: () => void;
};

export function TopBar({
  isAuthenticated,
  onConnectionsClick,
  onDiscoverClick,
  onLogout,
  onMessagesClick,
  onProfileClick,
}: TopBarProps) {
  const { matches, newDiscoveryMatchCount } = useChatMatches();
  const unreadMessageCount = matches.reduce(
    (count, match) => count + match.unreadCount,
    0,
  );

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
        <TopBarBrand />
      </Flex>

      {isAuthenticated ? (
        <Flex {...styles.rightActions}>
          <IconButton
            aria-label="Správy"
            icon={<MessageIconWithCount count={unreadMessageCount} />}
            onClick={onMessagesClick}
            {...topBarStyles.iconButton}
          />
          <IconButton
            aria-label="Zobraziť tvoje prepojenia"
            icon={<HeartIconWithCount count={newDiscoveryMatchCount} />}
            onClick={onConnectionsClick}
            {...topBarStyles.iconButton}
          />
        </Flex>
      ) : (
        <Flex aria-hidden="true" {...styles.emptySlot} />
      )}
    </Flex>
  );
}
