/**
 * Generated by orval
 * Do not edit manually.
 * Rebus backend
 */
import type { AnswerDto } from "./answerDto";

/**
 * Answers to all challenges for a particular team
 */
export interface TeamAnswerDto {
  /** List of answers to all challenges for the team */
  answers: AnswerDto[];
  /** ID of the team */
  teamId: number;
}
