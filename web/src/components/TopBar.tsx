import {
  useEffect,
  useState,
} from "react";
import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import hugIcon from "assets/hug.svg";
import matchIcon from "assets/match.svg";
import messageIcon from "assets/message.svg";
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
    px: { base: "12px", sm: "18px" },
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
    borderColor: "app.text",
    borderRadius: "8px",
    boxShadow: "0 16px 34px rgba(53, 87, 45, 0.18)",
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
    _focus: { bg: "rgba(0, 0, 0, 0.06)" },
    _hover: { bg: "rgba(0, 0, 0, 0.06)" },
  },
  menuItemIcon: {
    boxSize: "21px",
    color: "app.baseDark",
    flexShrink: 0,
  },
  brand: {
    align: "center",
    gap: { base: "11px", sm: "12px" },
    h: "44px",
    cursor: "pointer",
    textDecoration: "none",
    _hover: {
      textDecoration: "none",
    },
  },
  brandMark: {
    boxSize: "42px",
    minW: "42px",
    align: "center",
    bg: "app.white",
    border: "1px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    justify: "center",
  },
  brandText: {
    mt: "2px",
    ml: "-2px",
    color: "app.white",
    fontFamily:
      '"Comic Sans MS", "Comic Neue", "Trebuchet MS", Verdana, sans-serif',
    fontSize: { base: "21px", sm: "24px" },
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
    gap: { base: "6px", sm: "8px" },
  },
  leftActions: {
    align: "center",
    gap: { base: "6px", sm: "8px" },
    minW: 0,
  },
  matchIconWrap: {
    position: "relative",
    align: "center",
    justify: "center",
    boxSize: "31px",
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
    boxShadow: "0 1px 4px rgba(53, 87, 45, 0.28)",
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

function MatchIconWithCount({ count }: { count: number }) {
  return (
    <Flex {...styles.matchIconWrap}>
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

function ProfileMenuIcon({
  boxSize = "26px",
  color = "app.baseDark",
}: {
  boxSize?: string;
  color?: string;
}) {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      boxSize={boxSize}
      color={color}
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z" />
      <path d="M4.8 21a7.2 7.2 0 0 1 14.4 0" />
    </Icon>
  );
}

function LogoutMenuIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      {...styles.menuItemIcon}
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 5H6.8A2.8 2.8 0 0 0 4 7.8v8.4A2.8 2.8 0 0 0 6.8 19H10" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </Icon>
  );
}

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
        <Flex
          as={RouterLink}
          to="/discover"
          aria-label="Objavovať"
          {...styles.brand}
        >
          <Flex {...styles.brandMark}>
            <SvgImage
              src={hugIcon}
              w="34px"
              h="30px"
            />
          </Flex>
          <Text as="span" {...styles.brandText}>
            {appConfig.name}
          </Text>
        </Flex>
      </Flex>

      {isAuthenticated ? (
        <Flex {...styles.rightActions}>
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              aria-label="Používateľské menu"
              icon={<ProfileMenuIcon color="app.base" />}
              {...styles.iconButton}
            />
            <MenuList {...styles.menuList}>
              <MenuItem onClick={onProfileClick} {...styles.menuItem}>
                <ProfileMenuIcon boxSize="21px" />
                <Text as="span">Profil</Text>
              </MenuItem>
              <MenuItem onClick={onLogout} {...styles.menuItem}>
                <LogoutMenuIcon />
                <Text as="span">Odhlásiť</Text>
              </MenuItem>
            </MenuList>
          </Menu>
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
                window.dispatchEvent(new CustomEvent(toggleDiscoveryMatchesEvent));
                return;
              }

              onDiscoverClick();
            }}
            {...styles.iconButton}
          />
        </Flex>
      ) : (
        <Flex aria-hidden="true" {...styles.emptySlot} />
      )}
    </Flex>
  );
}
