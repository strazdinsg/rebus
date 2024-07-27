import {
  asyncApiGet,
  asyncApiGetBlob,
  asyncApiGetV2,
  asyncApiPost,
  asyncApiPostFile,
} from "./requests";
import { Answer, ShortTeamAnswers } from "../redux/answerSlice";
import { Challenge } from "../redux/challengeSlice";
import { Team } from "../redux/teamSlice";

//////////////////////////////////////
// API requests to the backend
//////////////////////////////////////

export type TeamAnswers = {
  teamId: number;
  answers: Answer[];
};

/**
 * Send request to API - Get all challenges
 * @return Promise to return the response body as JSON array
 * Throws an exception on error
 */
export function apiGetChallenges(): Promise<Challenge[]> {
  return asyncApiGetV2("/challenges") as any as Promise<Challenge[]>;
}

/**
 * Send request to API - get my answers
 * @return Promise to return the response body as JSON array
 * Throws an exception on error
 */
export function apiGetMyAnswers(): Promise<TeamAnswers> {
  return asyncApiGet("/answers/my") as any as Promise<TeamAnswers>;
}

/**
 * Send request to API - get answers of all users
 * @return Promise to return the response body as JSON array
 * Throws an exception on error
 */
export function apiGetAllAnswers(): Promise<ShortTeamAnswers[]> {
  return asyncApiGet("/answers") as any as Promise<ShortTeamAnswers[]>;
}

/**
 * Send request to API - get an image
 * @param challengeId ID of the challenge for which the image was submitted
 * @param userId ID of the owner user (team)
 * @return Promise to return the response body as a binary blob, which can be used to
 * generate image source. Use the response in this way: img.src = URL.createObjectURL(responseBlob)
 *
 * Throws an exception on error */
export function apiGetImage(
  challengeId: number,
  userId: number
): Promise<Blob> {
  return asyncApiGetBlob(`/pictures/${challengeId}/${userId}`);
}

export function apiUploadPicture(
  challengeId: number,
  userId: number,
  pictureContent: File
): Promise<JSON> {
  return asyncApiPostFile(`/pictures/${challengeId}/${userId}`, pictureContent);
}

export function apiPostAnswer(
  challengeId: number,
  userId: number,
  answer: string
): Promise<JSON> {
  // P.S. We include the challengeId simply because then we can re-use the AnswerDto object for parsing the
  // payload on the backend side
  return asyncApiPost(`/answers/${challengeId}/${userId}`, {
    challengeId: challengeId,
    answer: answer,
  });
}

/**
 * Send request to API - Get all teams
 * @return {Promise<[]>} Promise to return the response body as JSON array
 * Throws an exception on error
 */
export function apiGetTeams(): Promise<Team[]> {
  return asyncApiGet("/teams") as any as Promise<Team[]>;
}

/**
 * Send request to API - POST score for a specific question, specific team
 * @param challengeId ID of the challenge
 * @param userId ID of the user (team)
 * @param score The score. Null when score is deleted
 */
export function apiPostScore(
  challengeId: number,
  userId: number,
  score: number | null
): Promise<JSON> {
  return asyncApiPost(`/score/${challengeId}/${userId}`, { score: score });
}
