import { Flex, IconButton } from "@chakra-ui/react";

import { useChatMatches } from "src/context/chatMatches";
import messageIcon from "assets/message.svg";
import { MatchIconWithCount } from "src/components/top-bar/MatchIconWithCount";
import { TopBarBrand } from "src/components/top-bar/TopBarBrand";
import { TopBarIconButton } from "src/components/top-bar/TopBarIconButton";
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
  },
  leftActions: {
    align: "center",
    gap: { base: "6px", sm: "8px" },
    minW: 0,
  },
} as const;

export const toggleDiscoveryMatchesEvent =
  "priatelia:toggle-discovery-matches";

type TopBarProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
  onMessagesClick: () => void;
  onProfileClick: () => void;
};

export function TopBar({
  isAuthenticated,
  onLogout,
  onMessagesClick,
  onProfileClick,
}: TopBarProps) {
  const { newDiscoveryMatchCount } = useChatMatches();

  return (
    <Flex as="header" {...styles.root}>
      <Flex {...styles.leftActions}>
        <TopBarBrand />
      </Flex>

      {isAuthenticated ? (
        <Flex {...styles.rightActions}>
          <TopBarProfileMenu
            onLogout={onLogout}
            onProfileClick={onProfileClick}
          />
          <TopBarIconButton
            label="Správy"
            icon={messageIcon}
            onClick={onMessagesClick}
          />
          <IconButton
            aria-label="Zobraziť prepojenia"
            icon={
              <MatchIconWithCount
                count={newDiscoveryMatchCount}
              />
            }
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent(toggleDiscoveryMatchesEvent),
              );
            }}
            {...topBarStyles.iconButton}
          />
        </Flex>
      ) : (
        <Flex aria-hidden="true" {...styles.emptySlot} />
      )}
    </Flex>
  );
}
