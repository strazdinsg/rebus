/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// For .env file support
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = 80;
let port = DEFAULT_PORT;
if (process.env.VITE_DEV_SERVER_PORT) {
  port = parseInt(process.env.VITE_DEV_SERVER_PORT);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
  },
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
  esbuild: {
    target: "esnext",
  },
  test: {
    includeSource: ["src/**/*.{js,ts}"],
    exclude: ["src/jest-tests", "node_modules"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.js",
  },
});
