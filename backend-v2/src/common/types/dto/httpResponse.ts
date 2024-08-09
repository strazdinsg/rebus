export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

/**
 * HTTP status code of a request lacking authentication. The user is not logged in.
 */
export const UNAUTHORIZED = 401;
/**
 * HTTP status code of a request lacking authorization. The user may be logged in but
 * lacks the necessary permissions. The difference between 401 Unauthorized and 403 Forbidden
 * is that re-logging will not help in the case of 403.
 */
export const FORBIDDEN = 403;
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
