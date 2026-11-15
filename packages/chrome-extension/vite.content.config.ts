/**
 * Vite config — content script only (IIFE).
 */
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: { content: "src/content/content-script.ts" },
      output: {
        entryFileNames: "[name].js",
        format: "iife",
      },
    },
    sourcemap: false,
  },
});
