import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    app: {
      base: "#3b5a9d",
      white: "#ffffff",
      text: "#000000",
    },
  },
  fonts: {
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});
