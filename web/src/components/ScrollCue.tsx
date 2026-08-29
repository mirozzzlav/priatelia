import { Flex, Text } from "@chakra-ui/react";

import arrowDownIcon from "assets/arrow-down.svg";
import { SvgImage } from "src/components/SvgImage";

const styles = {
  root: {
    align: "center",
    justify: "center",
    gap: "8px",
    w: "min(72%, 280px)",
    h: "48px",
    mx: "auto",
    mt: "12px",
    borderRadius: "14px",
    color: "app.white",
    bg: "app.baseDark",
    fontSize: "lg",
    fontWeight: "semibold",
    backdropFilter: "blur(14px)",
    pointerEvents: "none",
  },
  icon: {
    boxSize: "18px",
    mt: "4px",
  },
} as const;

export function ScrollCue() {
  return (
    <Flex {...styles.root}>
      <Text>Skroluj</Text>
      <SvgImage src={arrowDownIcon} {...styles.icon} />
    </Flex>
  );
}
