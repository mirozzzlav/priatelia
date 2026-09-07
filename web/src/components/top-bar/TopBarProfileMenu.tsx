import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { LogoutMenuIcon } from "src/components/top-bar/LogoutMenuIcon";
import { ProfileMenuIcon } from "src/components/top-bar/ProfileMenuIcon";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

type TopBarProfileMenuProps = {
  onLogout: () => void;
  onProfileClick: () => void;
};

export function TopBarProfileMenu({
  onLogout,
  onProfileClick,
}: TopBarProfileMenuProps) {
  return (
    <Menu placement="bottom-end" offset={[108, 8]}>
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
  );
}
