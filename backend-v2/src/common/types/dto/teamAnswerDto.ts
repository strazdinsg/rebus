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

export type TeamAnswerResponseDto = HttpResponseDto<TeamAnswerDto[]>;
