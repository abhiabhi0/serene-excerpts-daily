
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { exec } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // This ensures assets are loaded correctly on GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'update-files-json',
      buildStart() {
        return new Promise((resolve, reject) => {
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
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Specify the output directory
    emptyOutDir: true, // Clean the output directory before building
  },
}));
