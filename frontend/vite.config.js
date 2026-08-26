import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', // Your backend port
    },
  },
  plugins: [react()],
})
