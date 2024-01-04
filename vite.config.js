import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://tasks-backend-aqvn2mjjy-fh-fahad.vercel.app",
    },
  },
  plugins: [react()],
});
