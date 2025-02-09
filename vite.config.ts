
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { generateStaticExcerptsPlugin } from "./src/utils/buildUtils";

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
    generateStaticExcerptsPlugin(), // Run in both dev and prod
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  json: {
    stringify: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
  },
}));
