  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react-swc";
  import path from "path";
  import { componentTagger } from "lovable-tagger";

  export default defineConfig(({ mode }) => ({
    base: "./",
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about/index.html'),
          blog: path.resolve(__dirname, 'blog/index.html')
        }
      }
    },
  }));