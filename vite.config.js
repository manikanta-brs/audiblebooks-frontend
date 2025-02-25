// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import svgr from "vite-plugin-svgr"; // Import vite-plugin-svgr

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(), // Keep react plugin
//     svgr({
//       // Call svgr() function and include it in plugins array
//       exportAsDefault: true,
//     }),
//   ],
//   server: {
//     host: "0.0.0.0",
//     port: 4000,
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"), // Alias configuration is good
//     },
//   },
// });

// vite.config.js
import { defineConfig, loadEnv } from "vite"; // Import loadEnv
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  // Add the 'mode' argument
  const env = loadEnv(mode, process.cwd()); // Load environment variables

  return {
    plugins: [
      react(),
      svgr({
        exportAsDefault: true,
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 4000,
      // Only enable these settings in development mode
      ...(mode === "development"
        ? {
            // Use mode instead of NODE_ENV
            allowedHosts: [
              "audiblebooks-frontend.onrender.com", // Add your Render domain
              "localhost", // Allow localhost for local development
            ],
            // You might also need to enable CORS in development for API calls
            // Especially if your backend is on a different domain
            cors: {
              origin: "*", // WARNING: Only for DEVELOPMENT!  Restrict in production
              methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
              allowedHeaders: ["Content-Type", "Authorization"],
            },
          }
        : {}), // Empty object for production (no server settings)
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
