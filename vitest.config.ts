import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  // Skip the app's Tailwind v4 PostCSS pipeline during unit tests.
  css: { postcss: { plugins: [] } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Every module that holds feature logic must be fully covered.
      include: [
        "lib/**/*.{ts,tsx}",
        "components/**/*.tsx",
        "app/api/**/*.ts",
      ],
      exclude: [
        "**/*.d.ts",
        "**/index.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "lib/types.ts", // type-only declarations, no runtime code
        "lib/supabase/**", // thin SDK wiring, exercised via integration/e2e
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
