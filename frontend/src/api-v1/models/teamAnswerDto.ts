/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 3.0.0
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
