import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
          animation: ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/system', '@mui/icons-material'],
  },
})
