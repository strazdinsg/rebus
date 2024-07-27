/**
 * Challenge DTO.
 * @property id ID of the challenge
 * @property question Question to be answered
 * @property maxScore Maximum score for the challenge
 */
export type ChallengeDto = {
  id: number;
  question: string;
  maxScore: number;
};
