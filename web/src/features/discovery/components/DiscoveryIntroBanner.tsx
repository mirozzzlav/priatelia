import { Box, Flex, Text } from "@chakra-ui/react";

import handshakeIcon from "assets/shake-hands.svg";
import { SvgImage } from "src/components/SvgImage";
import { useAuth } from "src/context/auth";

const styles = {
  root: {
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "12px", sm: "16px" },
    pt: "10px",
    pb: "12px",
    bg: "app.white",
    borderBottom: "1px solid",
    borderColor: "app.borderColor",
    transition: "padding 180ms ease, background 180ms ease",
  },
  inner: (isCompact: boolean) =>
    ({
      align: "center",
      minH: isCompact ? "44px" : "58px",
      gap: isCompact ? "10px" : "12px",
      transition: "min-height 180ms ease, gap 180ms ease",
    }) as const,
  sketch: (isCompact: boolean) =>
    ({
      position: "relative",
      flexShrink: 0,
      w: isCompact ? "40px" : "58px",
      h: isCompact ? "36px" : "46px",
      display: "grid",
      placeItems: "center",
      transition: "width 180ms ease, height 180ms ease",
    }) as const,
  icon: (isCompact: boolean) =>
    ({
      w: isCompact ? "40px" : "58px",
      h: isCompact ? "40px" : "58px",
      objectFit: "contain",
      transition: "width 180ms ease, height 180ms ease",
    }) as const,
  copy: {
    minW: 0,
  },
  title: {
    color: "app.text",
    fontSize: "sm",
    fontWeight: "black",
    lineHeight: 1.2,
  },
  greeting: {
    display: "block",
    color: "app.info",
    fontSize: { base: "lg", sm: "xl" },
    fontWeight: "black",
    lineHeight: 1.05,
  },
  nickname: {
    color: "app.text",
  },
  titleLine: {
    display: "block",
    mt: "3px",
  },
  text: (isCompact: boolean) =>
    ({
      mt: isCompact ? 0 : "3px",
      maxH: isCompact ? 0 : "36px",
      overflow: "hidden",
      color: "app.text",
      fontSize: "xs",
      fontWeight: "semibold",
      lineHeight: 1.35,
      opacity: isCompact ? 0 : 0.72,
      transition:
        "max-height 180ms ease, margin 180ms ease, opacity 140ms ease",
    }) as const,
} as const;

type DiscoveryIntroBannerProps = {
  isCompact?: boolean;
};

export function DiscoveryIntroBanner({
  isCompact = false,
}: DiscoveryIntroBannerProps) {
  const { session } = useAuth();
  const nickname = session?.nickname;

  return (
    <Box {...styles.root}>
      <Flex {...styles.inner(isCompact)}>
        <Box aria-hidden="true" {...styles.sketch(isCompact)}>
          <SvgImage src={handshakeIcon} {...styles.icon(isCompact)} />
        </Box>
        <Box {...styles.copy}>
          <Text {...styles.title}>
            {nickname ? (
              <>
                <Text as="span" {...styles.greeting}>
                  Ahoj{" "}
                  <Text as="span" {...styles.nickname}>
                    {nickname},
                  </Text>
                </Text>
                <Text as="span" {...styles.titleLine}>
                  spoznaj nových priateľov v okolí.
                </Text>
              </>
            ) : (
              "Spoznaj nových priateľov v okolí."
            )}
          </Text>
          <Text {...styles.text(isCompact)}>
            Pozri si ľudí nablízku a začni kontakt, ak ste si navzájom blízki.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
