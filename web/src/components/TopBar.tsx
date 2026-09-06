import {
  useEffect,
  useState,
} from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import hugIcon from "assets/hug.svg";
import logoutIcon from "assets/logout.svg";
import matchIcon from "assets/match.svg";
import messageIcon from "assets/message.svg";
import personIcon from "assets/person.svg";
import { appConfig } from "src/config.js";
import { SvgImage } from "src/components/SvgImage";

const styles = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    align: "center",
    justify: "space-between",
    h: "64px",
    px: "18px",
    bg: "app.base",
    color: "app.white",
    backdropFilter: "blur(18px)",
  },
  iconButton: {
    display: "grid",
    placeItems: "center",
    boxSize: "42px",
    minW: "42px",
    border: "1px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    color: "app.base",
    bg: "app.white",
    _hover: { bg: "app.white" },
    _active: { bg: "app.white" },
    _disabled: {
      bg: "app.white",
      borderColor: "app.white",
      cursor: "default",
      opacity: 1,
      _hover: { bg: "app.white" },
    },
  },
  menuList: {
    minW: "184px",
    mt: "8px",
    border: "1px solid",
    borderColor: "app.base",
    borderRadius: "8px",
    boxShadow: "0 16px 34px rgba(38, 57, 111, 0.18)",
    overflow: "hidden",
    p: 0,
  },
  menuItem: {
    alignItems: "center",
    color: "app.text",
    display: "flex",
    fontSize: "sm",
    fontWeight: "extrabold",
    gap: "12px",
    px: "16px",
    py: "12px",
    _focus: { bg: "app.bgAux" },
    _hover: { bg: "app.bgAux" },
  },
  menuItemIcon: {
    boxSize: "21px",
    flexShrink: 0,
  },
  brand: {
    align: "center",
    gap: "6px",
    h: "44px",
    cursor: "pointer",
    textDecoration: "none",
    _hover: {
      textDecoration: "none",
    },
  },
  brandMark: {
    w: "48px",
    h: "41px",
    align: "center",
    justify: "center",
  },
  brandText: {
    mt: "2px",
    ml: "-2px",
    color: "app.white",
    fontFamily:
      '"Comic Sans MS", "Comic Neue", "Trebuchet MS", Verdana, sans-serif',
    fontSize: "24px",
    fontWeight: "normal",
    lineHeight: 1,
    letterSpacing: "3px",
    textShadow: "none",
    transform: "scaleX(0.88)",
    transformOrigin: "left center",
    sx: {
      WebkitTextStroke: "0.5px var(--chakra-colors-app-white)",
      paintOrder: "stroke fill",
    },
  },
  emptySlot: {
    boxSize: "42px",
    flexShrink: 0,
  },
  rightActions: {
    align: "center",
    gap: "8px",
  },
  matchIconWrap: {
    position: "relative",
    align: "center",
    justify: "center",
    boxSize: "31px",
    transition: "opacity 140ms ease",
    sx: {
      "&[data-disabled='true']": {
        opacity: 0.44,
      },
    },
  },
  matchIconCount: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    alignItems: "center",
    justifyContent: "center",
    minW: "20px",
    h: "20px",
    px: "4px",
    border: "2px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    bg: "#F97316",
    color: "app.white",
    fontSize: "11px",
    fontWeight: "black",
    lineHeight: 1,
    boxShadow: "0 1px 4px rgba(38, 57, 111, 0.28)",
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

function MatchIconWithCount({
  count,
  isDisabled = false,
}: {
  count: number;
  isDisabled?: boolean;
}) {
  return (
    <Flex
      data-disabled={isDisabled ? "true" : undefined}
      {...styles.matchIconWrap}
    >
      <SvgImage src={matchIcon} boxSize="31px" />
      {count > 0 && (
        <Flex as="span" {...styles.matchIconCount}>
          {count > 99 ? "99+" : count}
        </Flex>
      )}
    </Flex>
  );
}

type TopBarIconButtonProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

function TopBarIconButton({ label, icon, onClick }: TopBarIconButtonProps) {
  return (
    <IconButton
      aria-label={label}
      icon={<SvgImage src={icon} boxSize="26px" />}
      onClick={onClick}
      {...styles.iconButton}
    />
  );
}

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
      {isAuthenticated ? (
        <Menu placement="bottom-start">
          <MenuButton
            as={IconButton}
            aria-label="Používateľské menu"
            icon={<SvgImage src={personIcon} boxSize="26px" />}
            {...styles.iconButton}
          />
          <MenuList {...styles.menuList}>
            <MenuItem onClick={onProfileClick} {...styles.menuItem}>
              <SvgImage src={personIcon} {...styles.menuItemIcon} />
              <Text as="span">Profil</Text>
            </MenuItem>
            <MenuItem onClick={onLogout} {...styles.menuItem}>
              <SvgImage src={logoutIcon} {...styles.menuItemIcon} />
              <Text as="span">Odhlásiť</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Flex aria-hidden="true" {...styles.emptySlot} />
      )}

      <Flex
        as={RouterLink}
        to="/discover"
        aria-label={appConfig.name}
        {...styles.brand}
      >
        <Flex {...styles.brandMark}>
          <SvgImage src={hugIcon} w="41px" h="35px" />
        </Flex>
        <Text as="span" {...styles.brandText}>
          {appConfig.name}
        </Text>
      </Flex>

      {isAuthenticated ? (
        <Flex {...styles.rightActions}>
          <TopBarIconButton
            label="Správy"
            icon={messageIcon}
            onClick={onMessagesClick}
          />
          {isDiscoverRoute && (
            <IconButton
              aria-label="Zobraziť nové prepojenia"
              icon={
                <MatchIconWithCount
                  count={discoveryMatchesSummary.count}
                  isDisabled={!discoveryMatchesSummary.canUseMatches}
                />
              }
              isDisabled={!discoveryMatchesSummary.canUseMatches}
              onClick={() => {
                window.dispatchEvent(new CustomEvent(toggleDiscoveryMatchesEvent));
              }}
              {...styles.iconButton}
            />
          )}
        </Flex>
      ) : (
        <Flex aria-hidden="true" {...styles.emptySlot} />
      )}
    </Flex>
  );
}
