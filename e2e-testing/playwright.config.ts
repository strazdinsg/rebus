import { defineConfig, devices } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
import {
  ADMIN_NAME,
  ADMIN_PIN,
  JWT_SECRET_KEY,
  USER_NAME,
  USER_PIN,
} from "./common";

// Load environment variables from .env file.
dotenvConfig();

const DEFAULT_FRONTEND_PORT = 80;
const DEFAULT_BACKEND_PORT = 8080;
const DEFAULT_BACKEND_V2_PORT = 3000;

let frontendPort = getPortFromEnvironment(
  "VITE_DEV_SERVER_PORT",
  DEFAULT_FRONTEND_PORT
);
let backendPort = getPortFromEnvironment("BACKEND_PORT", DEFAULT_BACKEND_PORT);
let backendV2Port = getPortFromEnvironment(
  "BACKEND_V2_PORT",
  DEFAULT_BACKEND_V2_PORT
);

const FRONTEND_URL = `http://localhost:${frontendPort}`;
const BACKEND_URL = `http://localhost:${backendPort}`;
const BACKEND_V2_URL = `http://localhost:${backendV2Port}`;

const testEnv = {
  ADMIN_PIN: ADMIN_PIN,
  USER_PIN: USER_PIN,
  USER_NAME: USER_NAME,
  ADMIN_NAME: ADMIN_NAME,
  TEST_JWT_SECRET_KEY: JWT_SECRET_KEY,
  NODE_ENV: "test",
  E2E_TEST: "true",
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Run local dev servers before starting the tests */
  webServer: [
    {
      /* Start the frontend server */
      cwd: "../frontend",
      command: "npm run start",
      url: FRONTEND_URL,
      timeout: 10 * 1000,
      reuseExistingServer: true,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      /* Start the backend server */
      cwd: "../backend",
      command: "mvn spring-boot:run -Dspring-boot.run.profiles=test,e2etest",
      env: testEnv,
      url: BACKEND_URL,
      timeout: 30 * 1000,
      reuseExistingServer: true,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      /* Start the backend v2 server */
      cwd: "../backend-v2",
      command: "npm run restart",
      url: BACKEND_V2_URL,
      timeout: 20 * 1000,
      reuseExistingServer: true,
      env: testEnv,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${frontendPort}`,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
});

function getPortFromEnvironment(envName: string, defaultPort: number) {
  let port: number = defaultPort;
  if (process.env[envName]) {
    port = parseInt(process.env[envName]);
  }
  return port;
}
