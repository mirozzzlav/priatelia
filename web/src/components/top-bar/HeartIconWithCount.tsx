import { Icon } from "@chakra-ui/react";

import { TopBarIconWithCount } from "src/components/top-bar/TopBarIconWithCount";

type HeartIconWithCountProps = {
  count: number;
};

export function HeartIconWithCount({ count }: HeartIconWithCountProps) {
  return (
    <TopBarIconWithCount count={count}>
      <Icon
        viewBox="0 0 24 24"
        boxSize="29px"
        color="app.base"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20.1 5.72 14.4C2.2 11.2 2.96 6.25 6.95 5.06c1.9-.57 3.64.1 5.05 1.72 1.41-1.62 3.15-2.29 5.05-1.72 3.99 1.19 4.75 6.14 1.23 9.34L12 20.1Z" />
      </Icon>
    </TopBarIconWithCount>
  );
}
