import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Import REST API BASE URL from the environment variable, see .env file
// Note: all environment variables must start with VITE_, otherwise Vite will not handle them!
// @ts-ignore - TypeScript does not know about the environment variable
export const API_V2_BASE_URL = import.meta.env.VITE_API_V2_BASE_URL;

const apiClient = axios.create({
  baseURL: API_V2_BASE_URL,
});

// TODO - add interceptors for JWT tokens etc.

// TODO - what is this?
export const customAxiosClient = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const response = await apiClient({ ...config, cancelToken: source.token });
  return response.data;
};
