import { Icon } from "@chakra-ui/react";

export type StatusIconVariant = "error" | "info" | "success";

type StatusIconProps = {
  boxSize: string;
  variant: StatusIconVariant;
};

export function StatusIcon({ boxSize, variant }: StatusIconProps) {
  const isSuccess = variant === "success";
  const isInfo = variant === "info";
  const primaryPath = isSuccess
    ? "M8.8 13.4l2.2 2.2 4.6-4.6"
    : isInfo
      ? "M12 12.4v3.4"
      : "M12 7.2v6.2";
  const dotPath = isInfo ? "M12 8.8h.01" : "M12 16.8h.01";

  return (
    <Icon viewBox="0 0 24 24" fill="none" boxSize={boxSize}>
      <path
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d={primaryPath}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!isSuccess && (
        <path
          d={dotPath}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Icon>
  );
}
