import { Icon } from "@chakra-ui/react";

export function CloseTopBarIcon() {
  return (
    <Icon
      viewBox="0 0 24 24"
      boxSize="24px"
      color="app.base"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.6"
      aria-hidden="true"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Icon>
  );
}
