import { Box, Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const styles = {
  root: {
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "12px", sm: "16px" },
    py: "8px",
    bg: "#fbeee3",
    borderBottom: "1px solid",
    borderColor: "app.infoBorder",
    boxShadow: "0 12px 30px rgba(53, 87, 45, 0.1)",
  },
  link: {
    color: "app.info",
    fontWeight: "900",
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    _focusVisible: {
      borderRadius: "6px",
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
      outline: "none",
    },
  },
  inner: {
    align: "center",
    minH: "32px",
    gap: "10px",
    textAlign: "left",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minW: "18px",
    h: "24px",
    gap: "3px",
    flexShrink: 0,
    color: "app.info",
  },
  iconDot: {
    boxSize: "6px",
    borderRadius: "999px",
    bg: "currentColor",
  },
  iconStem: {
    w: "5px",
    h: "14px",
    borderRadius: "999px",
    bg: "currentColor",
  },
  text: {
    fontSize: "sm",
    fontWeight: "normal",
    lineHeight: 1.25,
  },
  cta: {
    whiteSpace: "nowrap",
  },
} as const;

export function DiscoveryFeedbackBanner() {
  return (
    <Box {...styles.root}>
      <Flex {...styles.inner}>
        <Box aria-hidden="true" as="span" {...styles.icon}>
          <Box as="span" {...styles.iconDot} />
          <Box as="span" {...styles.iconStem} />
        </Box>
        <Text {...styles.text}>
          Aplikácia je v beta verzii. Budeme radi, ak nám necháš spätnú väzbu.{" "}
          <Text
            as={RouterLink}
            to="/feedback"
            {...styles.link}
            {...styles.cta}
          >
            Zanechaj spätnú väzbu.
          </Text>
        </Text>
      </Flex>
    </Box>
  );
}
