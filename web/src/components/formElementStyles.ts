export const compactPrimaryButtonStyles = {
  h: "38px",
  px: "16px",
  borderRadius: "999px",
  bg: "app.base",
  color: "app.white",
  fontSize: "xs",
  fontWeight: "black",
  _hover: { bg: "app.baseDark" },
  _active: { bg: "app.baseDark" },
  _focusVisible: {
    boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
  },
} as const;
