import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr"; // Import vite-plugin-svgr

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // Keep react plugin
    svgr({
      // Call svgr() function and include it in plugins array
      exportAsDefault: true,
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 4000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias configuration is good
    },
  },
});
