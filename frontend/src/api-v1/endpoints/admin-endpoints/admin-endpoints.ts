/**
 * Generated by orval
 * Do not edit manually.
 * Rebus backend
 */
import type {
  HttpResponseDtoListTeamDto,
  HttpResponseDtoString,
  SingleScoreDto,
} from "../../models";
import { apiV1AxiosClient } from "../../apiClient";

export const getAdminEndpoints = () => {
  /**
   * @summary Set score for a specific team, specific challenge
   */
  const setScore = (
    challengeId: number,
    userId: number,
    singleScoreDto: SingleScoreDto
  ) => {
    return apiV1AxiosClient<HttpResponseDtoString>({
      url: `/score/${challengeId}/${userId}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: singleScoreDto,
    });
  };
  /**
   * @summary Get all teams
   */
  const getAllTeams = () => {
    return apiV1AxiosClient<HttpResponseDtoListTeamDto>({
      url: `/teams`,
      method: "GET",
    });
  };
  return { setScore, getAllTeams };
};
export type SetScoreResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getAdminEndpoints>["setScore"]>>
>;
export type GetAllTeamsResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getAdminEndpoints>["getAllTeams"]>>
>;
