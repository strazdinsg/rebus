import { Router, Request, Response } from "express";
import db from "../db/dbConfig.js";
import { RowDataPacket } from "mysql2";
import { ChallengeDto } from "schemas/src/challenge";
import { SUCCESS } from "../server.js";

export const challengeRoutes = Router();

type HttpResponseDto<T> = {
  status: "SUCCESS" | "ERROR";
  data: T;
  message: string;
};

type ChallengeResponseDto = HttpResponseDto<ChallengeDto[]>;

/**
 * @swagger
 * components:
 *   schemas:
 *     ChallengeDto
 *       type:
 *       properties:
 *         id:
 *           type: integer
 *         question:
 *           type: string
 *         maxScore:
 *           type: integer
 *     ResponseDto:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [SUCCESS, ERROR]
 *         data:
 *           type: object
 *         message:
 *           type: string
 *
 */

/**
 * @swagger
 * /challenges:
 *   get:
 *     description: Get all challenges
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully fetched all challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [SUCCESS, ERROR]
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChallengeDto'
 *                 message:
 *                   type: string
 */
challengeRoutes.get(
  "/challenges",
  (
    req: Request<{}, {}, string>,
    res: Response<HttpResponseDto<ChallengeDto[]>>
  ) => {
    db.query("SELECT * FROM challenge", (err, results: RowDataPacket[]) => {
      if (err) {
        console.error(err);
        const responseBody: HttpResponseDto<ChallengeDto[]> = {
          status: "ERROR",
          data: [],
          message: "Internal server error",
        };
        res.status(500).send(responseBody);
      } else {
        const challenges: ChallengeDto[] = results.map((row) => {
          return {
            id: row.id,
            question: row.question,
            maxScore: row.max_score,
          };
        });
        const response: HttpResponseDto<ChallengeDto[]> = {
          status: SUCCESS,
          data: challenges,
          message: "",
        };
        res.send(response);
      }
    });
  }
);

export default challengeRoutes;
