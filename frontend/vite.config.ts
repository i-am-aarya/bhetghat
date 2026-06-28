import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
    // allowedHosts: [
    //   "https://6d8f-2404-7c00-49-accc-15c4-fbcc-737b-e37f.ngrok-free.app",
    // ],
  },
});
