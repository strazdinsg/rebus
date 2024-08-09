/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 3.0.0
 */

/**
 * Answer for one specific challenge (one specific team)
 */
export interface AnswerDto {
  /** The answer text */
  answer?: string;
  /** ID of the challenge */
  challengeId: number;
  /**
   * URL of the image submitted as an answer to a challenge by a team
   * @nullable
   */
  imageUrl?: string | null;
  /** Score given by the grader */
  score?: number;
}
