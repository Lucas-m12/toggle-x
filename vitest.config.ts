// vitest.config.ts
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 30000, // 30 seconds
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.spec.ts", "**/*.test.ts", "**/*.spec.ts"],
    exclude: ["node_modules", "dist", "drizzle/migrations"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      provider: 'istanbul',
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

