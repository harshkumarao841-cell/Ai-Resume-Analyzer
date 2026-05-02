import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward /api calls to FastAPI backend — eliminates CORS issues in dev
      '/api': {
        target: 'https://resume-backend-gigu.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
