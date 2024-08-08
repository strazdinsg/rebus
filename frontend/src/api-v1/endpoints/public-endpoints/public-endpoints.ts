/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 2.1.0
 */
import type {
  AuthenticationRequest,
  HttpResponseDtoAuthenticationResponse,
  HttpResponseDtoListChallengeDto,
} from "../../models";
import { apiV1AxiosClient } from "../../apiClient";

export const getPublicEndpoints = () => {
  /**
   * Log in with a PIN code. The PIN code is unique for each team.
   * @summary Log in
   */
  const authenticate = (authenticationRequest: AuthenticationRequest) => {
    return apiV1AxiosClient<HttpResponseDtoAuthenticationResponse>({
      url: `/authenticate`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: authenticationRequest,
    });
  };
  /**
   * @summary Get all challenges
   */
  const getAllChallenges = () => {
    return apiV1AxiosClient<HttpResponseDtoListChallengeDto>({
      url: `/challenges`,
      method: "GET",
    });
  };
  return { authenticate, getAllChallenges };
};
export type AuthenticateResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getPublicEndpoints>["authenticate"]>>
>;
export type GetAllChallengesResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getPublicEndpoints>["getAllChallenges"]>>
>;
