/**
 * Vite config — background service worker only (IIFE).
 */
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const sharedCorePath = fileURLToPath(
  new URL("../shared-core/src/index.ts", import.meta.url),
);

export default defineConfig({
  resolve: {
    alias: { "@chiasma/shared-core": sharedCorePath },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: { background: resolve(__dirname, "src/background/service-worker.ts") },
      output: {
        entryFileNames: "[name].js",
        format: "iife",
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
