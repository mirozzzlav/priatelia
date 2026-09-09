import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { CountBadge } from "src/components/CountBadge";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

type TopBarIconWithCountProps = {
  children: ReactNode;
  count: number;
};

export function TopBarIconWithCount({
  children,
  count,
}: TopBarIconWithCountProps) {
  return (
    <Flex {...styles.countedIconWrap}>
      {children}
      {count > 0 && (
        <CountBadge {...styles.iconCount}>
          {count > 99 ? "99+" : count}
        </CountBadge>
      )}
    </Flex>
  );
}
