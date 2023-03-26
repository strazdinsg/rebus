import { asyncApiGet } from "./requests";

//////////////////////////////////////
// API requests to the backend
//////////////////////////////////////

/**
 * Send request to API - Get all challenges
 * @return {Promise<string>} Promise to return the response body as JSON array
 * Throws and exception on error
 */
export function apiGetChallenges() {
  return asyncApiGet("/challenges");
}