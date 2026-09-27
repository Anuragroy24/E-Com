import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-server proxy so the browser sees same-origin requests to /api,
// while Vite forwards them to the Express server on port 3000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
