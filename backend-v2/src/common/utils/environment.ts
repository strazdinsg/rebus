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

/**
 * Check if the current environment is an E2E test environment.
 * @returns True if the current environment is an E2E test environment, false otherwise.
 */
export function isE2ETestEnvironment(): boolean {
  return isTestEnvironment() && process.env.E2E_TEST === "true";
}

/**
 * Get an environment variable.
 * @param envParamName Name of the environment variable
 * @param defaultValue Default value to return if the environment variable is not set
 * @returns The value of the environment variable, or the default value if the environment variable is not set.
 */
export function getEnv(envParamName: string, defaultValue: string): string {
  loadEnvironmentVariables();
  return process.env[envParamName] || defaultValue;
}

/**
 * Get an environment variable.
 * @param envParamName Name of the environment variable
 * @param defaultValue Default value to return if the environment variable is not set
 * @returns The value of the environment variable, or the default value if the environment variable is not set.
 */
export function getEnvN(envParamName: string, defaultValue: number): number {
  loadEnvironmentVariables();
  let value: number = defaultValue;
  if (process.env[envParamName] !== undefined) {
    value = parseInt(process.env[envParamName]);
  }
  return value;
}

/**
 * Get an environment variable, or crash if it is not set.
 * @param envParamName Name of the environment variable
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not set.
 */
export function getEnvOrCrash(envParamName: string): string {
  loadEnvironmentVariables();
  if (process.env[envParamName] === undefined) {
    throw new Error(`Environment variable ${envParamName} is not set`);
  }
  return process.env[envParamName];
}
