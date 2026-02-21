import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 300000,
    hookTimeout: 300000,
    alias: {
      "@vtdr/contracts": path.resolve(
        repoRoot,
        "./packages/contracts/index.ts",
      ),
      "@vtdr/data": path.resolve(repoRoot, "./packages/data/src/index.ts"),
      "@vtdr/engine": path.resolve(repoRoot, "./packages/engine/index.ts"),
    },
  },
});
