/**
 * Generated by orval
 * Do not edit manually.
 * rebus-backend
 */
import type { TeamAnswerDto } from "./teamAnswerDto";
import type { HttpResponseDtoTeamAnswerDtoArrayStatus } from "./httpResponseDtoTeamAnswerDtoArrayStatus";

/**
 * Generic HTTP response body.
 */
export interface HttpResponseDtoTeamAnswerDtoArray {
  data: TeamAnswerDto[];
  message: string;
  status: HttpResponseDtoTeamAnswerDtoArrayStatus;
}
