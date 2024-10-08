/**
 * Generated by orval
 * Do not edit manually.
 * Rebus backend
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
