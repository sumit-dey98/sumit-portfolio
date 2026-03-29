import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: isDev ? '[name]__[local]' : '[hash:base64:5]',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', '@gsap/react'],
          motion: ['motion'],
        }
      }
    }
  }
})