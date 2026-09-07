import { Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import logo from "assets/logo.svg";
import { appConfig } from "src/config.js";
import { SvgImage } from "src/components/SvgImage";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

export function TopBarBrand() {
  return (
    <Flex
      as={RouterLink}
      to="/discover"
      aria-label="Objavovať"
      {...styles.brand}
    >
      <Flex {...styles.brandMark}>
        <SvgImage src={logo} />
      </Flex>
      <Text as="span" {...styles.brandText}>
        {appConfig.name}
      </Text>
    </Flex>
  );
}
