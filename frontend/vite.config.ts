import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["executive-menus-gamecube-mtv.trycloudflare.com"],
    proxy: {
      '/api': {
        target: 'https://francisco-unscholarlike-punctually.ngrok-free.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        }
      }
    }
  },
});
