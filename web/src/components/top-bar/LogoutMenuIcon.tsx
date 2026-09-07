import { Icon } from "@chakra-ui/react";

import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

export function LogoutMenuIcon() {
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
