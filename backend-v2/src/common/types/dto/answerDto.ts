/**
 * Answer DTO.
 *
 * @property challengeId ID of the challenge
 * @property answer Answer to the challenge
 * @property score Score of the answer given by the administrator
 * @property imageUrl URL of the image posted by the user
 */
export type AnswerDto = {
  challengeId: number;
  answer: string | null;
  score: number | null;
  imageUrl: string | null;
};
