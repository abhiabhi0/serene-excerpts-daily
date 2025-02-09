
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { exec } from 'child_process';
import type { Plugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Changed from "./" to "/" for correct path resolution
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'update-files-json',
      buildStart(options) {
        return new Promise<void>((resolve, reject) => {
          exec('node scripts/updateFiles.js', (error) => {
            if (error) {
              console.error('Error updating files.json:', error);
              reject(error);
            } else {
              resolve();
            }
          });
        });
      },
    } as Plugin
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));
