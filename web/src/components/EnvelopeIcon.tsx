import { Icon, type IconProps } from "@chakra-ui/react";

export function EnvelopeIcon(props: IconProps) {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.5 6.5h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
      <path d="m3.2 7.8 8.8 6.7 8.8-6.7" />
    </Icon>
  );
}
