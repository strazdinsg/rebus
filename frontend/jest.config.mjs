/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  // Use the DOM, allow browser-based tests
  testEnvironment: "jsdom",
  transform: {
    // Use ts-jest preprocessor to transpile TypeScript before running tests
    "^.+.tsx?$": ["ts-jest", {}],
  },
};

export default config;
