import { Box, Flex, Text } from "@chakra-ui/react";

import { useAuth } from "src/context/auth";

const styles = {
  root: {
    mx: { base: "-12px", sm: "-16px" },
    px: { base: "12px", sm: "16px" },
    pt: "8px",
    pb: "8px",
    bg: "app.white",
    borderBottom: "1px solid",
    borderColor: "app.borderColor",
  },
  inner: {
    align: "center",
    minH: "34px",
  },
  copy: {
    minW: 0,
  },
  title: {
    color: "app.text",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: { base: "sm", sm: "md" },
    fontWeight: "black",
    lineHeight: 1.2,
  },
  greeting: {
    display: "inline",
  },
  nickname: {
    color: "app.info",
  },
  titleLine: {
    display: "inline",
  },
} as const;

export function DiscoveryIntroBanner() {
  const { session } = useAuth();
  const nickname = session?.nickname;

  return (
    <Box {...styles.root}>
      <Flex {...styles.inner}>
        <Box {...styles.copy}>
          <Text {...styles.title}>
            {nickname ? (
              <>
                <Text as="span" {...styles.greeting}>
                  Ahoj{" "}
                  <Text as="span" {...styles.nickname}>
                    {nickname},
                  </Text>
                </Text>{" "}
                <Text as="span" {...styles.titleLine}>
                  spoznaj nových priateľov v okolí.
                </Text>
              </>
            ) : (
              "Spoznaj nových priateľov v okolí."
            )}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
