/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 2.0.0
 */
import type { TeamAnswerDto } from "./teamAnswerDto";
import type { HttpResponseDtoTeamAnswerDtoStatus } from "./httpResponseDtoTeamAnswerDtoStatus";

/**
 * Response from the server
 */
export interface HttpResponseDtoTeamAnswerDto {
  data?: TeamAnswerDto;
  /** A message explaining the response, in case of errors */
  message?: string;
  /** Response status: success or error */
  status?: HttpResponseDtoTeamAnswerDtoStatus;
}
