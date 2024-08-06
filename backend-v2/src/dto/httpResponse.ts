export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

/**
 * Generic HTTP response body.
 */
export type HttpResponseDto<T> = {
  status: "SUCCESS" | "ERROR";
  data: T;
  message: string;
};

export type ErrorResponseDto = {
  status: "ERROR";
  message: string;
  data: null;
};
