import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: "./",
  server: {
    host: "::",
    port: 8080
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      // Add external dependencies that shouldn't be bundled
      external: ['firebase', 'firebase/app', 'firebase/messaging'],
      output: {
        manualChunks: {
          // Separate Firebase into its own chunk
          firebase: ['firebase/app', 'firebase/messaging'],
        },
      },
    },
    // Ensure that dynamic imports work properly
    dynamicImportVarsOptions: {
      warnOnError: true,
    },
    // Improve source maps for debugging
    sourcemap: true,
  },
  // Ensure optimizations don't break Firebase
  optimizeDeps: {
    include: ['firebase/app', 'firebase/messaging'],
  },
});