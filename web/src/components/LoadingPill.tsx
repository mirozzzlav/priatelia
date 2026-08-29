import { Flex, Text } from "@chakra-ui/react";

import { SvgImage } from "src/components/SvgImage";

const styles = {
  pill: {
    position: "relative",
    align: "center",
    gap: "10px",
    px: "16px",
    py: "11px",
    overflow: "hidden",
    border: "1px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.92)",
    color: "app.baseDark",
    fontSize: "sm",
    fontWeight: "extrabold",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)",
    _after: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      w: "46%",
      bg: "app.base",
      content: '""',
      opacity: 0.12,
      animation: "loadingPillBar 1.2s ease-in-out infinite",
    },
    sx: {
      "@keyframes loadingPillBar": {
        "0%": {
          transform: "translateX(-120%)",
        },
        "100%": {
          transform: "translateX(260%)",
        },
      },
    },
  },
  content: {
    position: "relative",
    zIndex: 1,
    align: "center",
    gap: "10px",
  },
  icon: {
    flexShrink: 0,
  },
} as const;

type LoadingPillProps = {
  icon?: string;
  text: string;
};

export function LoadingPill({ icon, text }: LoadingPillProps) {
  return (
    <Flex {...styles.pill}>
      <Flex {...styles.content}>
        {icon && <SvgImage src={icon} boxSize="22px" {...styles.icon} />}
        <Text>{text}</Text>
      </Flex>
    </Flex>
  );
}
