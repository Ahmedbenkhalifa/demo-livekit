import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// import usePluginImport from "vite-plugin-importer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: 'http://localhost:3000',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 3000,
  },
  plugins: [react(), tsconfigPaths()],
  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@sentry')) {
            return 'sentry'
          }

          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
    sourcemap: true,
  },
})
