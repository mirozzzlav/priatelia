import { Box, Flex, Text } from "@chakra-ui/react";

import handshakeIcon from "assets/shake-hands.svg";
import { SvgImage } from "src/components/SvgImage";

const styles = {
  root: {
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "12px", sm: "16px" },
    pt: "10px",
    pb: "17px",
    bg: "rgba(255, 255, 255, 0.9)",
    borderBottom: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.14)",
  },
  inner: {
    align: "center",
    minH: "58px",
    gap: "12px",
  },
  sketch: {
    position: "relative",
    flexShrink: 0,
    w: "92px",
    h: "46px",
    display: "grid",
    placeItems: "center",
  },
  icon: {
    w: "58px",
    h: "58px",
    objectFit: "contain",
  },
  copy: {
    minW: 0,
  },
  title: {
    color: "app.text",
    fontSize: "sm",
    fontWeight: "black",
    lineHeight: 1.2,
  },
  text: {
    mt: "3px",
    color: "app.text",
    fontSize: "xs",
    fontWeight: "semibold",
    lineHeight: 1.35,
    opacity: 0.72,
  },
} as const;

export function DiscoveryIntroBanner() {
  return (
    <Box {...styles.root}>
      <Flex {...styles.inner}>
        <Box aria-hidden="true" {...styles.sketch}>
          <SvgImage src={handshakeIcon} {...styles.icon} />
        </Box>
        <Box {...styles.copy}>
          <Text {...styles.title}>Spoznaj nových priateľov v okolí.</Text>
          <Text {...styles.text}>
            Pozri si ľudí nablízku a začni kontakt, ak ste si navzájom blízki.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
