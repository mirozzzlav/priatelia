import { Icon } from "@chakra-ui/react";

type ProfileMenuIconProps = {
  boxSize?: string;
  color?: string;
};

export function ProfileMenuIcon({
  boxSize = "26px",
  color = "app.baseDark",
}: ProfileMenuIconProps) {
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
