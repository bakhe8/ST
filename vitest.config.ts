import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts"],
    alias: {
      "@vtdr/contracts": path.resolve(
        __dirname,
        "./packages/contracts/index.ts",
      ),
      "@vtdr/data": path.resolve(__dirname, "./packages/data/src/index.ts"),
      "@vtdr/engine": path.resolve(__dirname, "./packages/engine/index.ts"),
    },
  },
});
