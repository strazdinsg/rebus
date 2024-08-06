import express, { urlencoded } from "express";
import cors from "cors";
import { corsOptions } from "./corsOptions";
import { loadEnvironmentVariables } from "./environment";
import { RegisterRoutes } from "./routes/routes";
import path from "path";
import { errorHandler } from "./errorHandler";

loadEnvironmentVariables();

const DEFAULT_PORT = 3000;
const port = process.env.SERVER_PORT || DEFAULT_PORT;

const server = express();
server.use(cors(corsOptions));
// Middleware to parse JSON request bodies
server.use(urlencoded({ extended: true }));
server.use(express.json());

RegisterRoutes(server);

server.use(errorHandler);

server.get("/", (req, res) => {
  res.send("Rebus backend, v2");
});
server.get("/openapi-docs.json", (req, res) => {
  const filePath = path.join(__dirname, "/swagger.json");
  res.sendFile(filePath);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
