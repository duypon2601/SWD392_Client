import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Đảm bảo đường dẫn đúng
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true, // Hỗ trợ route của React Router
  },
});
