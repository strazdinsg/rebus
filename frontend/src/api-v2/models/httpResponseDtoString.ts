/**
 * Generated by orval
 * Do not edit manually.
 * rebus-backend
 */
import type { HttpResponseDtoStringStatus } from "./httpResponseDtoStringStatus";

/**
 * Generic HTTP response body.
 */
export interface HttpResponseDtoString {
  data: string;
  message: string;
  status: HttpResponseDtoStringStatus;
}
