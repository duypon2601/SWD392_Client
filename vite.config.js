import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Đảm bảo đường dẫn tương đối
  server: {
    historyApiFallback: true, // Hỗ trợ React Router
  },
  build: {
    outDir: "dist", // Đảm bảo thư mục build đúng
  },
});
