import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Include files to be tested
    include: ["src/**/*.test.ts"],
    // or use: include: ['**/*.test.{js,ts}'],
    environment: "node", // Set the test environment to 'node' for backend testing
    globals: true, // Enables Jest-like global APIs
  },
});
