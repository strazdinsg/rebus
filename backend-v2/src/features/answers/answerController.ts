import { TeamAnswerResponseDto } from "../../common/types/dto/teamAnswerDto";
import { Get, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { ErrorResponseDto } from "../../common/types/dto/httpResponse";

@Route("answers")
@Tags("Admin endpoints")
export class AnswerController {
  /**
   * Get all answers for all teams, long version. Accessible by admins only.
   */
  @Get("/long")
  @SuccessResponse("200", "Ok")
  @Response<ErrorResponseDto>(401, "Unauthorized (only accessible by admins)")
  @Security("jwt", ["ROLE_ADMIN"])
  public async getAllAnswers(): Promise<TeamAnswerResponseDto> {
    return {
      status: "SUCCESS",
      data: [],
      message: "",
    };
  }
}
