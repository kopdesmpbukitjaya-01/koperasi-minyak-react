import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

  plugins: [

    react(),

    tailwindcss(),

    VitePWA({

      registerType: "autoUpdate",

      manifest: {

        name: "Koperasi Desa Merah Putih Bukit Jaya",

        short_name: "KDMP Bukit Jaya",

        description:
          "Sistem Informasi Koperasi Desa Merah Putih Bukit Jaya",

        theme_color: "#dc2626",

        background_color: "#ffffff",

        display: "standalone",

        start_url: "/",

        icons: [

          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },

          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }

        ]

      }

    })

  ]

});