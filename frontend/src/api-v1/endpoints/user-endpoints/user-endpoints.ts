/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * Rebus backend
 * OpenAPI spec version: 2.0.0
 */
import type {
  HttpResponseDtoTeamAnswerDto,
  MyAnswerDto,
  UploadPictureBody,
} from "../../models";
import { apiV1AxiosClient } from "../../apiClient";

export const getUserEndpoints = () => {
  /**
   * @summary Get image submitted as an answer to a challenge by a team
   */
  const getPicture = (challengeId: number, userId: number) => {
    return apiV1AxiosClient<string>({
      url: `/pictures/${challengeId}/${userId}`,
      method: "GET",
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
  /**
   * @summary Delete an image submitted as an answer to a challenge by a team
   */
  const deletePicture = (challengeId: number, userId: number) => {
    return apiV1AxiosClient<string>({
      url: `/pictures/${challengeId}/${userId}`,
      method: "DELETE",
    });
  };
  /**
   * @summary Post an answer to a challenge
   */
  const postAnswer = (
    challengeId: number,
    userId: number,
    myAnswerDto: MyAnswerDto
  ) => {
    return apiV1AxiosClient<string>({
      url: `/answers/${challengeId}/${userId}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: myAnswerDto,
    });
  };
  /**
   * @summary Get answers of the currently logged-in user
   */
  const getMyAnswers = () => {
    return apiV1AxiosClient<HttpResponseDtoTeamAnswerDto>({
      url: `/answers/my`,
      method: "GET",
    });
  };
  return { getPicture, uploadPicture, deletePicture, postAnswer, getMyAnswers };
};
export type GetPictureResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["getPicture"]>>
>;
export type UploadPictureResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["uploadPicture"]>>
>;
export type DeletePictureResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["deletePicture"]>>
>;
export type PostAnswerResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["postAnswer"]>>
>;
export type GetMyAnswersResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getUserEndpoints>["getMyAnswers"]>>
>;