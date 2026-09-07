import { useEffect, useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

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

export const discoveryMatchesSummaryEvent =
  "priatelia:discovery-matches-summary";
export const toggleDiscoveryMatchesEvent =
  "priatelia:toggle-discovery-matches";

type DiscoveryMatchesSummary = {
  canUseMatches: boolean;
  count: number;
};

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
  const location = useLocation();
  const isDiscoverRoute = location.pathname === "/discover";
  const [discoveryMatchesSummary, setDiscoveryMatchesSummary] =
    useState<DiscoveryMatchesSummary>({
      canUseMatches: false,
      count: 0,
    });

  useEffect(() => {
    const handleSummaryChange = (event: Event) => {
      const detail = (event as CustomEvent<DiscoveryMatchesSummary>).detail;

      setDiscoveryMatchesSummary({
        canUseMatches: Boolean(detail?.canUseMatches),
        count: detail?.count ?? 0,
      });
    };

    window.addEventListener(
      discoveryMatchesSummaryEvent,
      handleSummaryChange,
    );

    return () => {
      window.removeEventListener(
        discoveryMatchesSummaryEvent,
        handleSummaryChange,
      );
    };
  }, []);

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
            aria-label="Zobraziť nové prepojenia"
            icon={
              <MatchIconWithCount
                count={discoveryMatchesSummary.count}
              />
            }
            isDisabled={
              isDiscoverRoute && !discoveryMatchesSummary.canUseMatches
            }
            onClick={() => {
              if (isDiscoverRoute) {
                window.dispatchEvent(
                  new CustomEvent(toggleDiscoveryMatchesEvent),
                );
                return;
              }

              onDiscoverClick();
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
