import {
  asyncApiGet,
  asyncApiGetBlob,
  asyncApiGetV2,
  asyncApiPost,
  asyncApiPostFile,
} from "./requests";
import { z } from "zod";
import { ChallengeResponseBody } from "schemas/src/responses";
import { ShortTeamAnswersDto, TeamAnswersDto } from "schemas/src/answer";
import { TeamDto } from "schemas/src/team";
import { MyAnswerDto } from "schemas/src/answer";

//////////////////////////////////////
// API requests to the backend
//////////////////////////////////////

/**
 * Send request to API - Get all challenges
 * @return Promise to return the response body as JSON array
 * Throws an exception on error
 */
export async function apiGetChallenges(): Promise<ChallengeResponseBody> {
  return await asyncApiGetV2<ChallengeResponseBody>(
    "/challenges",
    ChallengeResponseBody
  );
}

/**
 * Send request to API - get my answers
 * @return Promise to return the response body as JSON array
 * Throws an exception on error
 */
export async function apiGetMyAnswers(): Promise<TeamAnswersDto> {
  return await asyncApiGet<TeamAnswersDto>("/answers/my", TeamAnswersDto);
}

/**
 * Send request to API - get answers of all users
 * @return Promise to return the response body as JSON array
 * Throws an exception on error
 */
export async function apiGetAllAnswers(): Promise<ShortTeamAnswersDto[]> {
  return await asyncApiGet<ShortTeamAnswersDto[]>(
    "/answers",
    z.array(ShortTeamAnswersDto)
  );
}

/**
 * Send request to API - get an image
 * @param challengeId ID of the challenge for which the image was submitted
 * @param userId ID of the owner user (team)
 * @return Promise to return the response body as a binary blob, which can be used to
 * generate image source. Use the response in this way: img.src = URL.createObjectURL(responseBlob)
 *
 * Throws an exception on error */
export async function apiGetImage(
  challengeId: number,
  userId: number
): Promise<Blob> {
  return await asyncApiGetBlob(`/pictures/${challengeId}/${userId}`);
}

export async function apiUploadPicture(
  challengeId: number,
  userId: number,
  pictureContent: File
): Promise<JSON> {
  return await asyncApiPostFile(
    `/pictures/${challengeId}/${userId}`,
    pictureContent
  );
}

export async function apiPostAnswer(
  challengeId: number,
  userId: number,
  answer: string
): Promise<string> {
  const answerDto: MyAnswerDto = {
    challengeId: challengeId,
    answer: answer,
  };
  return await asyncApiPost<string>(
    `/answers/${challengeId}/${userId}`,
    z.string(),
    answerDto
  );
}

/**
 * Send request to API - Get all teams
 * @return {Promise<[]>} Promise to return the response body as JSON array
 * Throws an exception on error
 */
export async function apiGetTeams(): Promise<TeamDto[]> {
  return await asyncApiGet<TeamDto[]>("/teams", z.array(TeamDto));
}

/**
 * Send request to API - POST score for a specific question, specific team
 * @param challengeId ID of the challenge
 * @param userId ID of the user (team)
 * @param score The score. Null when score is deleted
 */
export async function apiPostScore(
  challengeId: number,
  userId: number,
  score: number | null
): Promise<string> {
  return await asyncApiPost<string>(
    `/score/${challengeId}/${userId}`,
    z.string(),
    {
      score: score,
    }
  );
}
