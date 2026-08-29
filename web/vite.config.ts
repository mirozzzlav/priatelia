import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { appConfig } from "./src/config.js";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "chakra-vendor": [
            "@chakra-ui/react",
            "@emotion/react",
            "@emotion/styled",
            "framer-motion",
          ],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  plugins: [
    {
      name: "app-config-html",
      transformIndexHtml(html) {
        return html.replaceAll("%APP_TITLE%", escapeHtml(appConfig.name));
      },
    },
    react(),
  ],
  resolve: {
    alias: {
      assets: fileURLToPath(new URL("./assets", import.meta.url)),
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4444,
  },
});
