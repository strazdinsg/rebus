import { asyncApiGet, asyncApiGetBlob, asyncApiPostFile } from "./requests";

//////////////////////////////////////
// API requests to the backend
//////////////////////////////////////

/**
 * Send request to API - Get all challenges
 * @return {Promise<[]>} Promise to return the response body as JSON array
 * Throws an exception on error
 */
export function apiGetChallenges() {
  return asyncApiGet("/challenges");
}

/**
 * Send request to API - get my answers
 * @return {Promise<[]>} Promise to return the response body as JSON array
 * Throws an exception on error
 */
export function apiGetMyAnswers() {
  return asyncApiGet("/answers/my");
}

/**
 * Send request to API - get an image
 * @param challengeId ID of the challenge for which the image was submitted
 * @param userId ID of the owner user (team)
 * @return {Promise<object>} Promise to return the response body as a binary blob, which can be used to
 * generate image source. Use the response in this way: img.src = URL.createObjectURL(responseBlob)
 *
 * Throws an exception on error */
export function apiGetImage(challengeId, userId) {
  return asyncApiGetBlob(`/pictures/${challengeId}/${userId}`);
}

export function apiUploadPicture(challengeId, userId, pictureContent) {
  return asyncApiPostFile(`/pictures/${challengeId}/${userId}`, pictureContent);
}
