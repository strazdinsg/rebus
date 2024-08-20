/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  // Use the DOM, allow browser-based tests
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  preset: "ts-jest/presets/default-esm",
  transform: {
    // Use ts-jest to transpile TypeScript and TSX to ESM JavaScript
    // The useESM option is required for import.meta to work
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
    // Use babel-jest to transpile JavaScript and JSX to ESM JavaScript
    "^.+\\.(js|jsx)$": ["babel-jest"],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).(ts|tsx|js|jsx)"],
  // Mock CSS imports
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  // To fix the error of not finding module msw/node
  // See https://mswjs.io/docs/migrations/1.x-to-2.x#cannot-find-module-mswnode-jsdom
  // testEnvironmentOptions: {
  //   customExportConditions: [""],
  // },
};

export default config;
