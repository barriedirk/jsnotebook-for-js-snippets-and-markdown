import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
      "@blunder": path.resolve(__dirname, "/src/blunder"),
      "@components": path.resolve(__dirname, "/src/components"),
      "@hooks": path.resolve(__dirname, "/src/hooks"),
      "@state": path.resolve(__dirname, "/src/state"),
    },
  },
  plugins: [react()],
});
