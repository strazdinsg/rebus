import express from "express";
import db from "./db/dbConfig.js";
import cors from "cors";
import { corsOptions } from "./corsOptions.js";
import { loadEnvironmentVariables } from "./environment.js";
import { ChallengeDto } from "schemas/src/dto/challenge";
import { RowDataPacket } from "mysql2";

loadEnvironmentVariables();

const DEFAULT_PORT = 3000;
const port = process.env.SERVER_PORT || DEFAULT_PORT;

const server = express();
server.use(cors(corsOptions));

server.get("/", (req, res) => {
  res.send("Rebus backend, v2");
});

server.get("/challenges", (req, res) => {
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
      res.send(challenges);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
