import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { SITE_META } from './src/data/site.config.js'

const isDev = process.env.NODE_ENV === 'development';

// Injects the title/description/theme colour from site.config.js into
// index.html, so branding lives in exactly one place.
// Falls back per-key so a missing or half-written site.config.js degrades to
// sensible defaults instead of failing every page request.
const FALLBACK_META = {
  title: 'Portfolio',
  description: '',
  themeColor: '#080810',
};

const htmlMeta = () => ({
  name: 'html-site-meta',
  transformIndexHtml: (html) => {
    const meta = { ...FALLBACK_META, ...(SITE_META || {}) };
    return html
      .replace(/%SITE_TITLE%/g, meta.title)
      .replace(/%SITE_DESCRIPTION%/g, meta.description)
      .replace(/%SITE_THEME_COLOR%/g, meta.themeColor);
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const cloudName = env.CLOUDINARY_CLOUD_NAME || '';

  return {
    plugins: [react(), htmlMeta()],
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
            flickity: ['flickity'],
            react: ['react', 'react-dom', 'react-router-dom'],
            icons: ['react-icons'],
          }
        }
      }
    },
    server: {
      // Dev-only proxy for Cloudinary assets. Set CLOUDINARY_CLOUD_NAME in .env
      // to enable; without it the /cdn proxy is simply not registered.
      proxy: cloudName
        ? {
          '/cdn': {
            target: `https://res.cloudinary.com/${cloudName}`,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/cdn/, '')
          }
        }
        : {}
    }
  };
})
