import { AnswerDto } from "./answerDto";
import { HttpResponseDto } from "./httpResponse";

/**
 * Team answer DTO.
 *
 * @property teamId ID of the team
 * @property answers Answers of the team
 */
export type TeamAnswerDto = {
  teamId: number;
  answers: AnswerDto[];
};

/**
 * Answers for one team.
 */
export type TeamAnswerResponseDto = HttpResponseDto<TeamAnswerDto>;
/**
 * Answers for all teams.
 */
export type TeamListAnswerResponseDto = HttpResponseDto<TeamAnswerDto[]>;
