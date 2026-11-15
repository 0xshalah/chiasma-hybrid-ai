/**
 * Vite config for CHIASMA Chrome Extension — side panel build.
 * Builds the React side panel UI as ESM with HTML processing.
 *
 * Background service worker + content script are built separately
 * by vite.scripts.config.ts (IIFE, no HTML).
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const sharedCorePath = fileURLToPath(
  new URL("../shared-core/src/index.ts", import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@chiasma/shared-core": sharedCorePath,
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, "src/sidepanel/index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name][extname]",
        format: "es",
      },
    },
    sourcemap: false,
  },
  define: {
    __FIREBASE_API_KEY__: JSON.stringify(process.env.VITE_FIREBASE_API_KEY ?? ""),
    __FIREBASE_PROJECT_ID__: JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID ?? ""),
    __FIREBASE_AUTH_DOMAIN__: JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN ?? ""),
    __GEMINI_CLOUD_MODEL__: JSON.stringify(process.env.VITE_GEMINI_CLOUD_MODEL ?? "gemini-2.0-flash"),
    __FRICTION_THRESHOLD__: JSON.stringify(process.env.VITE_FRICTION_THRESHOLD ?? "0.75"),
  },
});
