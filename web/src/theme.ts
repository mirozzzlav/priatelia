import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    app: {
      base: "#3b5a9d",
      baseDark: "#26396f",
      info: "#ffa633",
      error: "#9f3f4a",
      success: "#3f8f65",
      white: "#ffffff",
      text: "#000000",
      bgAux: "#ffc982",
    },
  },
  fonts: {
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    heading:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  styles: {
    global: {
      "*": {
        boxSizing: "border-box",
      },
      html: {
        minH: "100%",
        letterSpacing: 0,
      },
      body: {
        position: "relative",
        isolation: "isolate",
        minH: "100vh",
        m: 0,
        bg: "app.base",
        color: "app.text",
        fontSize: "md",
        _before: {
          position: "fixed",
          inset: 0,
          zIndex: -2,
          bgImage:
            'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80")',
          bgPosition: "center",
          bgSize: "cover",
          content: '""',
          filter: "grayscale(1)",
        },
        _after: {
          position: "fixed",
          inset: 0,
          zIndex: -1,
          bg: "app.base",
          content: '""',
          opacity: 0.24,
        },
      },
      button: {
        font: "inherit",
      },
    },
  },
});
