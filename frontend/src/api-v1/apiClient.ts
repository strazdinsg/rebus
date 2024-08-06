import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_V1_BASE_URL } from "../tools/requests.js";

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
