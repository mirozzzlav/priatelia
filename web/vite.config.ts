import { defineConfig, loadEnv } from "vite";
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devPort = Number(env.VITE_DEV_PORT ?? 4444);
  const publicAppUrl = (env.VITE_PUBLIC_APP_URL ?? appConfig.publicUrl).replace(
    /\/+$/,
    "",
  );
  const socialImageUrl = new URL(
    appConfig.social.imagePath,
    `${publicAppUrl}/`,
  ).toString();
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET ??
    env.API_PROXY_TARGET ??
    "http://localhost:3000";
  const mediaProxyTarget =
    env.VITE_MEDIA_PROXY_TARGET ??
    env.MEDIA_PROXY_TARGET ??
    "http://localhost:9000";

  return {
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
          const replacements = {
            "%APP_DESCRIPTION%": appConfig.social.description,
            "%APP_IMAGE_ALT%": appConfig.social.imageAlt,
            "%APP_IMAGE_URL%": socialImageUrl,
            "%APP_LOCALE%": appConfig.social.locale,
            "%APP_SITE_NAME%": appConfig.name,
            "%APP_TITLE%": appConfig.social.title,
            "%APP_URL%": publicAppUrl,
          };

          return Object.entries(replacements).reduce(
            (currentHtml, [placeholder, value]) =>
              currentHtml.replaceAll(placeholder, escapeHtml(value)),
            html,
          );
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
      host: env.VITE_DEV_HOST ?? "0.0.0.0",
      port: Number.isNaN(devPort) ? 4444 : devPort,
      proxy: {
        "/api": {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          target: apiProxyTarget,
          ws: true,
        },
        "/profile-photos": {
          changeOrigin: true,
          target: mediaProxyTarget,
        },
      },
    },
  };
});
