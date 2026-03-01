import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Base must be relative so deployed under GitHub Pages subpath works
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // When invoked by build-pages.mjs, outDir is overridden via CLI
  },
})
