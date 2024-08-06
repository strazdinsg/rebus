import { AxiosRequestConfig } from "axios";
import { createApiClient } from "../tools/genericApiClient";

// Import REST API BASE URL from the environment variable, see .env file
// Note: all environment variables must start with VITE_, otherwise Vite will not handle them!
// @ts-ignore - TypeScript does not know about the environment variable
export const API_V1_BASE_URL = import.meta.env.VITE_API_V1_BASE_URL;

const apiClient = createApiClient(API_V1_BASE_URL);

export const apiV1AxiosClient = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient(config);
  return response.data;
};
