import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getCookie } from "./cookies";

/**
 * Create a generic API client that can be used to make requests to the API.
 * @param baseUrl BASE URL of the API
 */
export function createApiClient(baseUrl: string) {
  const apiClient = axios.create({ baseURL: baseUrl });
  // Add JWT token to the Authorization header
  apiClient.interceptors.request.use(
    (config) => {
      const token = getCookie("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
  return apiClient;
}

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
