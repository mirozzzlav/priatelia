import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import logo from "assets/logo.svg";
import { SvgImage } from "src/components/SvgImage";
import { LogoutMenuIcon } from "src/components/top-bar/LogoutMenuIcon";
import { ProfileMenuIcon } from "src/components/top-bar/ProfileMenuIcon";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

type TopBarProfileMenuProps = {
  onDiscoverClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
};

export function TopBarProfileMenu({
  onDiscoverClick,
  onLogout,
  onProfileClick,
}: TopBarProfileMenuProps) {
  return (
    <Menu placement="bottom-start">
      <MenuButton
        as={IconButton}
        aria-label="Otvoriť menu"
        icon={<BurgerMenuIcon />}
        {...styles.iconButton}
      />
      <MenuList {...styles.menuList}>
        <MenuItem onClick={onDiscoverClick} {...styles.menuItem}>
          <Box
            alignItems="center"
            boxSize="21px"
            display="flex"
            flexShrink={0}
            justifyContent="center"
          >
            <SvgImage src={logo} boxSize="34px" maxW="none" />
          </Box>
          <Text as="span">Objavuj</Text>
        </MenuItem>
        <MenuItem onClick={onProfileClick} {...styles.menuItem}>
          <ProfileMenuIcon boxSize="21px" color="app.base" />
          <Text as="span">Profil</Text>
        </MenuItem>
        <MenuItem onClick={onLogout} {...styles.menuItem}>
          <LogoutMenuIcon />
          <Text as="span">Odhlásiť</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function BurgerMenuIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      boxSize="26px"
      color="app.base"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  );
}
