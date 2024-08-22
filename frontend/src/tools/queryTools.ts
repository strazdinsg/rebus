import { UseQueryResult } from "@tanstack/react-query";
import type { HttpResponseDtoStringStatus } from "../api-v1/models";

/**
 * A simplified query result.
 */
export type QueryResult<T> = {
  isPending: boolean;
  error: Error | null;
  data: T | null;
};

type HttpResponse = {
  /** The data that the server will send in the response, can be null */
  data?: unknown;
  /** A message explaining the response, in case of errors */
  message?: string;
  /** Response status: success or error */
  status?: HttpResponseDtoStringStatus;
};

/**
 * Convert a query result to a simplified query result.
 * @param query The TanStack query result to convert.
 * @returns A simplified query result.
 */
export function convertQueryResult<ResponseType extends HttpResponse, DataType>(
  query: UseQueryResult<ResponseType, Error>
): QueryResult<DataType> {
  const data = query.isFetched ? (query.data!.data as DataType) : null;
  return {
    isPending: query.isPending,
    error: query.error,
    data: data,
  };
}
