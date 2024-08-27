import {
  TeamAnswerResponseDto,
  TeamListAnswerResponseDto,
} from "../../common/types/dto/teamAnswerDto";
import * as express from "express";
import {
  Get,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
  Request,
} from "tsoa";
import { ErrorResponseDto } from "../../common/types/dto/httpResponse";
import { answerService } from "./answerService";
import { HttpError } from "../../common/types/httpError";

@Route("answers")
export class AnswerController {
  /**
   * Get all answers for all teams. Accessible by admins only.
   */
  @Get()
  @Tags("Admin endpoints")
  @SuccessResponse("200", "Ok")
  @Response<ErrorResponseDto>(401, "Unauthorized (only accessible by admins)")
  @Security("jwt", ["ROLE_ADMIN"])
  public async getAllAnswers(): Promise<TeamListAnswerResponseDto> {
    try {
      const answers = await answerService.getAll();
      return {
        status: "SUCCESS",
        data: answers,
        message: "",
      };
    } catch (e) {
      throw new HttpError(500, "Database query failure");
    }
  }

  /**
   * Get all answers for the current user, long version. Accessible by users only.
   */
  @Get("my")
  @Tags("User endpoints")
  @SuccessResponse("200", "Ok")
  @Response<ErrorResponseDto>(401, "Unauthorized (only accessible by users)")
  @Security("jwt", ["ROLE_USER"])
  public async getMyAnswers(
    @Request() request: express.Request
  ): Promise<TeamAnswerResponseDto> {
    const sessionUserId = request.sessionUserId;
    if (!sessionUserId) {
      throw new HttpError(401, "Unauthorized");
    }

    try {
      const answers = await answerService.getAnswersForTeam(sessionUserId);
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
