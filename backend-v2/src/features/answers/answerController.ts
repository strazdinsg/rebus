import { TeamAnswerResponseDto } from "../../common/types/dto/teamAnswerDto";
import { Get, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { ErrorResponseDto } from "../../common/types/dto/httpResponse";
import { answerRepository } from "./answerRepository";
import { HttpError } from "../../common/types/httpError";

@Route("answers")
@Tags("Admin endpoints")
export class AnswerController {
  /**
   * Get all answers for all teams, long version. Accessible by admins only.
   */
  @Get("/long")
  @SuccessResponse("200", "Ok")
  @Response<ErrorResponseDto>(401, "Unauthorized (only accessible by admins)")
  @Response<ErrorResponseDto>(500, "Internal Server Error")
  @Security("jwt", ["ROLE_ADMIN"])
  public async getAllAnswers(): Promise<TeamAnswerResponseDto> {
    try {
      const answers = await answerRepository.getAll();
      return {
        status: "SUCCESS",
        data: answers,
        message: "",
      };
    } catch (e) {
      throw new HttpError(500, "Database query failure");
    }
  }
}
