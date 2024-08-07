/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 3.0.0
 */
import type { AuthenticationResponse } from "./authenticationResponse";
import type { HttpResponseDtoAuthenticationResponseStatus } from "./httpResponseDtoAuthenticationResponseStatus";

/**
 * Response from the server
 */
export interface HttpResponseDtoAuthenticationResponse {
  data?: AuthenticationResponse;
  /** A message explaining the response, in case of errors */
  message?: string;
  /** Response status: success or error */
  status?: HttpResponseDtoAuthenticationResponseStatus;
}
