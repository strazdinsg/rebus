/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 2.1.0
 */
import type { TeamAnswerDto } from "./teamAnswerDto";
import type { HttpResponseDtoListTeamAnswerDtoStatus } from "./httpResponseDtoListTeamAnswerDtoStatus";

/**
 * Response from the server
 */
export interface HttpResponseDtoListTeamAnswerDto {
  /** The data that the server will send in the response, can be null */
  data?: TeamAnswerDto[];
  /** A message explaining the response, in case of errors */
  message?: string;
  /** Response status: success or error */
  status?: HttpResponseDtoListTeamAnswerDtoStatus;
}