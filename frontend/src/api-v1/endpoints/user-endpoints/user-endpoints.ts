/**
 * Generated by orval
 * Do not edit manually.
 * Rebus backend
 */
import type {
  HttpResponseDtoTeamAnswerDto,
  UploadPictureBody,
} from "../../models";
import { apiV1AxiosClient } from "../../apiClient";

export const getUserEndpoints = () => {
  /**
   * @summary Get answers of the currently logged-in user
   */
  const getMyAnswers = () => {
    return apiV1AxiosClient<HttpResponseDtoTeamAnswerDto>({
      url: `/answers/my`,
      method: "GET",
    });
  };
  /**
   * @summary Post an answer to a challenge
   */
  const postAnswer = (
    challengeId: number,
    userId: number,
    postAnswerBody: string
  ) => {
    return apiV1AxiosClient<string>({
      url: `/answers/${challengeId}/${userId}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: postAnswerBody,
    });
  };
  /**
   * @summary Upload an image to the server
   */
  const uploadPicture = (
    challengeId: number,
    userId: number,
    uploadPictureBody: UploadPictureBody
  ) => {
    return apiV1AxiosClient<string>({
      url: `/pictures/${challengeId}/${userId}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: uploadPictureBody,
    });
  };
  return { getMyAnswers, postAnswer, uploadPicture };
};
export type GetMyAnswersResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["getMyAnswers"]>>
>;
export type PostAnswerResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["postAnswer"]>>
>;
export type UploadPictureResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["uploadPicture"]>>
>;
