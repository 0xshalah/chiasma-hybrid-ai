import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const sharedCorePath = fileURLToPath(
  new URL("../shared-core/src/index.ts", import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
  resolve: {
    alias: {
      "@chiasma/shared-core": sharedCorePath,
    },
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
