import { Flex, Icon } from "@chakra-ui/react";

import { CountBadge } from "src/components/CountBadge";
import { topBarStyles as styles } from "src/components/top-bar/topBarStyles";

type MatchIconWithCountProps = {
  count: number;
};

export function MatchIconWithCount({ count }: MatchIconWithCountProps) {
  return (
    <Flex {...styles.matchIconWrap}>
      <Icon
        viewBox="0 0 24 24"
        boxSize="31px"
        color="app.base"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.1a4 4 0 0 1-4 4H9.2L4 21v-2.9a3.5 3.5 0 0 1-2-3.2V7.8a4 4 0 0 1 4-4h10.5a4 4 0 0 1 4 4v6.3Z" />
        <path
          d="M11.4 14.9 8.25 12c-1.75-1.63-1.38-4.18.69-4.78.94-.28 1.81.05 2.46.87.65-.82 1.52-1.15 2.46-.87 2.07.6 2.44 3.15.69 4.78l-3.15 2.9Z"
          color="var(--chakra-colors-app-error)"
          fill="currentColor"
          stroke="currentColor"
        />
      </Icon>
      {count > 0 && (
        <CountBadge {...styles.matchIconCount}>
          {count > 99 ? "99+" : count}
        </CountBadge>
      )}
    </Flex>
  );
}
