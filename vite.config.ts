import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === "build" ? "/yasc/" : "/",
    staged: {
      "*": "vp check --fix",
    },
    plugins: [
      react(),
      tailwindcss(),
      // basicSsl(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,yaml,woff,woff2}"], // Assets to be pre-cached for offline use
        },
        devOptions: {
          enabled: true, // Allows testing offline features during development
        },
        manifest: {
          name: "Yet Another Score Calculator",
          short_name: "YASC",
          description:
            "A clean, interactive, and offline-first web app designed for computing scores in any kind of point-based system.",
          theme_color: "#221f22",
          display: "standalone",
          start_url: "/yasc/",
          scope: "/yasc/",
          icons: [
            {
              src: "pwa/512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "pwa/192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "pwa/512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "pwa/192-maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            // {
            //   src: "favicon.svg",
            //   sizes: "512x512",
            //   type: "image/svg+xml",
            //   purpose: "any",
            // },
            // {
            //   src: "favicon-maskable.svg",
            //   sizes: "192x192",
            //   type: "image/svg+xml",
            //   purpose: "maskable",
            // },
          ],
          screenshots: [
            {
              src: "pwa/landscape.jpg",
              sizes: "1827x1103",
              type: "image/jpeg",
              form_factor: "wide",
              label: "Application",
            },
            {
              src: "pwa/portrait.jpg",
              sizes: "651x1050",
              type: "image/jpeg",
              form_factor: "narrow",
              label: "Application",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@shadcn": path.resolve(__dirname, "./src/components/shadcn"),
      },
    },
  };
});
