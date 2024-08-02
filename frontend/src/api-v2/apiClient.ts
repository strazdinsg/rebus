import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_V2_BASE_URL } from "../tools/requests.js";

const apiClient = axios.create({
  baseURL: API_V2_BASE_URL,
});

// TODO - add interceptors for JWT tokens etc.

// TODO - what is this?
export const customAxiosClient = async <T>(
  config: AxiosRequestConfig<T>
): Promise<T> => {
  const source = axios.CancelToken.source();
  const response = await apiClient({ ...config, cancelToken: source.token });
  return response.data;
};
