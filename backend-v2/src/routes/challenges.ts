import { Router } from "express";
import db from "../db/dbConfig.js";
import { RowDataPacket } from "mysql2";
import { ChallengeDto } from "schemas/src/challenge";
import { SUCCESS } from "../server.js";

export const challengeRoutes = Router();

challengeRoutes.get("/challenges", (req, res) => {
  db.query("SELECT * FROM challenge", (err, results: RowDataPacket[]) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else {
      const challenges: ChallengeDto[] = results.map((row) => {
        return {
          id: row.id,
          question: row.question,
          maxScore: row.max_score,
        };
      });
      const response = {
        status: SUCCESS,
        data: challenges,
        message: "",
      };
      res.send(response);
    }
  });
});

export default challengeRoutes;
