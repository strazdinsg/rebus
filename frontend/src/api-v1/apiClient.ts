import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_V1_BASE_URL } from "../tools/requests.js";

const apiClient = axios.create({
  baseURL: API_V1_BASE_URL,
});

// TODO - add interceptors for JWT tokens etc.

// TODO - what is this?
export const customAxiosClient = <T>(
  config: AxiosRequestConfig<T>
): Promise<AxiosResponse<T>> => {
  const source = axios.CancelToken.source();
  const promise = apiClient({ ...config, cancelToken: source.token });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Operation canceled by the user.");
  };

  return promise;
};

// TODO - what is this?
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
