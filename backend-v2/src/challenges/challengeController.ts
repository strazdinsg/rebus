import { Get, Route, SuccessResponse, Response, Tags } from "tsoa";
import { ChallengeResponseDto } from "../dto/challenge";
import { challengeRepository } from "./challengeRepository";
import { HttpError } from "../httpError";
import { ErrorResponseDto } from "../dto/httpResponse";

/**
 * REST API controller for the challenges.
 */
@Route("challenges")
@Tags("Public endpoints")
export class ChallengeController {
  @Get()
  @SuccessResponse("200", "Ok")
  @Response<ErrorResponseDto>(500, "Internal Server Error")
  public async getChallenges(): Promise<ChallengeResponseDto> {
    try {
      const challenges = await challengeRepository.getAll();
      return {
        status: "SUCCESS",
        data: challenges,
        message: "",
      };
    } catch (error) {
      const errorMessage = (error as Error).message || "Something went wrong";
      throw new HttpError(404, errorMessage);
    }
  }
}
