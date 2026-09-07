import { IconButton } from "@chakra-ui/react";

import { SvgImage } from "src/components/SvgImage";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

type TopBarIconButtonProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

export function TopBarIconButton({
  label,
  icon,
  onClick,
}: TopBarIconButtonProps) {
  return (
    <IconButton
      aria-label={label}
      icon={<SvgImage src={icon} boxSize="26px" />}
      onClick={onClick}
      {...styles.iconButton}
    />
  );
}
