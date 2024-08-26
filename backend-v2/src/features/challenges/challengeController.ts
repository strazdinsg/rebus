import { Get, Route, SuccessResponse, Response, Tags } from "tsoa";
import { ChallengeResponseDto } from "../../common/types/dto/challengeDto";
import { challengeService } from "./challengeService";
import { HttpError } from "../../common/types/httpError";
import { ErrorResponseDto } from "../../common/types/dto/httpResponse";

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
      const challenges = await challengeService.getAll();
      return {
        status: "SUCCESS",
        data: challenges,
        message: "",
      };
    } catch (error) {
      const errorMessage = (error as Error).message || "Something went wrong";
      throw new HttpError(500, errorMessage);
    }
  }
}
