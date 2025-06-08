import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    // Disable analytics and tracking
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
        // Inline all assets
        inlineDynamicImports: true
      }
    },
    // Ensure all assets are inlined
    assetsInlineLimit: 100000000
  },
  define: {
    // Prevent analytics/tracking SDKs
    'process.env.NODE_ENV': '"production"',
    'window.amplitude': 'undefined',
    'window.gtag': 'undefined',
    'window.ga': 'undefined',
    'window.mixpanel': 'undefined',
    'window.analytics': 'undefined'
  },
  // Remove any potential analytics plugins
  plugins: []
})

