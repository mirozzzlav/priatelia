import { SvgImage } from "src/components/SvgImage";
import { TopBarIconWithCount } from "src/components/top-bar/TopBarIconWithCount";
import messageIcon from "assets/message.svg";

type MessageIconWithCountProps = {
  count: number;
};

export function MessageIconWithCount({ count }: MessageIconWithCountProps) {
  return (
    <TopBarIconWithCount count={count}>
      <SvgImage src={messageIcon} boxSize="26px" />
    </TopBarIconWithCount>
  );
}
