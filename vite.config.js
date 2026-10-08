import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/catalog-image": {
        target: "https://res.cloudinary.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace("/catalog-image", "/dvjjqokdy/image/upload"),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "pwa-maskable-512x512.png",
        "og-image.jpg",
        "products-fallback.json",
      ],
      manifest: {
        id: "/",
        name: "Global-GS Store",
        short_name: "Global-GS",
        description:
          "Catalogo de tecnologia, accesorios, CCTV, redes y soporte tecnico.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#001a44",
        background_color: "#ffffff",
        orientation: "portrait",
        lang: "es-DO",
        categories: ["shopping", "business", "technology"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,svg}"],
      },
    }),
  ],
});
