import { Box, Flex } from "@chakra-ui/react";

const styles = {
  root: {
    align: "center",
    justify: "center",
    w: "53px",
    h: "78px",
    mx: "auto",
    mt: "10px",
    mb: "18px",
    color: "app.textAlt",
    opacity: 0.68,
    pointerEvents: "none",
  },
  mouse: {
    position: "relative",
    w: "29px",
    h: "46px",
    border: "2px solid",
    borderColor: "currentColor",
    borderRadius: "999px",
    _before: {
      position: "absolute",
      top: "8px",
      left: "50%",
      w: "5px",
      h: "11px",
      borderRadius: "999px",
      bg: "currentColor",
      content: '""',
      transform: "translateX(-50%)",
      animation: "scrollCueWheel 1.35s ease-in-out infinite",
    },
    _after: {
      position: "absolute",
      bottom: "-16px",
      left: "50%",
      w: "10px",
      h: "10px",
      borderRight: "2px solid",
      borderBottom: "2px solid",
      borderColor: "currentColor",
      content: '""',
      transform: "translateX(-50%) rotate(45deg)",
      opacity: 0.62,
      animation: "scrollCueArrow 1.35s ease-in-out infinite",
    },
    sx: {
      "@keyframes scrollCueWheel": {
        "0%": {
          opacity: 0,
          transform: "translate(-50%, -2px)",
        },
        "35%": {
          opacity: 1,
        },
        "100%": {
          opacity: 0,
          transform: "translate(-50%, 11px)",
        },
      },
      "@keyframes scrollCueArrow": {
        "0%, 100%": {
          opacity: 0.28,
          transform: "translate(-50%, -2px) rotate(45deg)",
        },
        "50%": {
          opacity: 0.72,
          transform: "translate(-50%, 3px) rotate(45deg)",
        },
      },
    },
  },
} as const;

export function ScrollCue() {
  return (
    <Flex {...styles.root}>
      <Box aria-hidden="true" {...styles.mouse} />
    </Flex>
  );
}
