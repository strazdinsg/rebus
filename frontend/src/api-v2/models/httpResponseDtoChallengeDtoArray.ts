/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * rebus-backend
 * Backend for the Rebus application, in Node.js
 * OpenAPI spec version: 2.3.0
 */
import type { ChallengeDto } from "./challengeDto";
import type { HttpResponseDtoChallengeDtoArrayStatus } from "./httpResponseDtoChallengeDtoArrayStatus";

/**
 * Generic HTTP response body.
 */
export interface HttpResponseDtoChallengeDtoArray {
  data: ChallengeDto[];
  message: string;
  status: HttpResponseDtoChallengeDtoArrayStatus;
}