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
  Path,
  Body,
  Post,
} from "tsoa";
import {
  ErrorResponseDto,
  HttpResponseDto,
} from "../../common/types/dto/httpResponse";
import { answerService } from "./answerService";
import { HttpError } from "../../common/types/httpError";
import { isCurrentUserAllowedToAccessResource } from "../../common/middleware/authentication";
import { SimpleAnswerDto } from "../../common/types/dto/simpleAnswerDto";

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

  @Post("{challengeId}/{userId}")
  @Tags("User endpoints")
  @SuccessResponse("200", "Ok")
  @Response<ErrorResponseDto>(401, "Unauthorized (only accessible by users)")
  @Response<ErrorResponseDto>(403, "Can't access the answer")
  @Security("jwt", ["ROLE_USER"])
  public async postAnswer(
    @Path() userId: number,
    @Path() challengeId: number,
    @Body() answer: SimpleAnswerDto,
    @Request() request: express.Request
  ): Promise<HttpResponseDto<string>> {
    if (!isCurrentUserAllowedToAccessResource(userId, request)) {
      throw new HttpError(403, "Unauthorized");
    }
    try {
      await answerService.saveAnswer(challengeId, userId, answer.answer);
      return {
        status: "SUCCESS",
        data: "",
        message: "",
      };
    } catch (e) {
      throw new HttpError(500, "Database query failure");
    }
  }
}
