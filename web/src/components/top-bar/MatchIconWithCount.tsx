import { Flex } from "@chakra-ui/react";

import matchIcon from "assets/match.svg";
import { SvgImage } from "src/components/SvgImage";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

type MatchIconWithCountProps = {
  count: number;
};

export function MatchIconWithCount({ count }: MatchIconWithCountProps) {
  return (
    <Flex {...styles.matchIconWrap}>
      <SvgImage src={matchIcon} boxSize="31px" />
      {count > 0 && (
        <Flex as="span" {...styles.matchIconCount}>
          {count > 99 ? "99+" : count}
        </Flex>
      )}
    </Flex>
  );
}
