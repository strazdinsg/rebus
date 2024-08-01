import express from "express";
import cors from "cors";
import { corsOptions } from "./corsOptions.js";
import { loadEnvironmentVariables } from "./environment.js";
import challengeRoutes from "./routes/challenges.js";
import setupSwaggerDocs from "./swagger.js";

loadEnvironmentVariables();

const DEFAULT_PORT = 3000;
const port = process.env.SERVER_PORT || DEFAULT_PORT;

const server = express();
server.use(cors(corsOptions));
// Middleware to parse JSON request bodies
server.use(express.json());

server.use("/", challengeRoutes);

export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

server.get("/", (req, res) => {
  res.send("Rebus backend, v2");
});

setupSwaggerDocs(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
