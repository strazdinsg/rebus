import dotenv from "dotenv";

let environmentVariablesLoaded = false;

/**
 * Load environment variables from .env file.
 */
export function loadEnvironmentVariables() {
  if (!environmentVariablesLoaded) {
    dotenv.config();
    environmentVariablesLoaded = true;
  }
}

/**
 * Check if the current environment is a test environment.
 * @returns True if the current environment is a test environment, false otherwise.
 */
export function isTestEnvironment(): boolean {
  loadEnvironmentVariables();
  return process.env.NODE_ENV === "test";
}
