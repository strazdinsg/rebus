import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Import REST API BASE URL from the environment variable, see .env file
// Note: all environment variables must start with VITE_, otherwise Vite will not handle them!
// @ts-ignore - TypeScript does not know about the environment variable
export const API_V1_BASE_URL = import.meta.env.VITE_API_V1_BASE_URL;

const apiClient = axios.create({
  baseURL: API_V1_BASE_URL,
});

// TODO - add interceptors for JWT tokens etc.

export const customAxiosClient = <T>(
  config: AxiosRequestConfig<T>
): Promise<AxiosResponse<T>> => {
  return apiClient(config);
};

// TODO - what is this?
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
