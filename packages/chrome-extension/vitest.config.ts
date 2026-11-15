import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const sharedCorePath = fileURLToPath(
  new URL("../shared-core/src/index.ts", import.meta.url),
);

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [],
    include: ["src/__tests__/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@chiasma/shared-core": sharedCorePath,
    },
  },
});
