/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 2.0.0
 */
import type { HttpResponseDtoStringStatus } from "./httpResponseDtoStringStatus";

/**
 * Response from the server
 */
export interface HttpResponseDtoString {
  /** The data that the server will send in the response, can be null */
  data?: string;
  /** A message explaining the response, in case of errors */
  message?: string;
  /** Response status: success or error */
  status?: HttpResponseDtoStringStatus;
}
