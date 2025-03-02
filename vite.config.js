import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 🔥 Cố định port 5173
    strictPort: true, // Không tự động đổi port nếu 5173 đang bị chiếm
  },
})
