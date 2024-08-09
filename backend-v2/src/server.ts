import express, { Express, urlencoded } from "express";
import cors from "cors";
import { corsOptions } from "./common/middleware/corsOptions";
import { RegisterRoutes } from "./tsoa/routes";
import path from "path";
import { errorHandler } from "./common/middleware/errorHandler";

export const server = express();
initializeMiddleware(server);
initializeCommonRoutes(server);
RegisterRoutes(server);

/**
 * Initializes common middlewares for the server.
 *
 * @param server Express server
 */
function initializeMiddleware(server: Express) {
  // CORS
  server.use(cors(corsOptions));
  // JSON parser
  server.use(urlencoded({ extended: true }));
  server.use(express.json());
  // Common error handler
  server.use(errorHandler);
}

/**
 * Initializes common routes for the server.
 *
 * @param server Express server
 */
function initializeCommonRoutes(server: Express) {
  server.get("/", (req, res) => {
    res.send("Rebus backend, v2");
  });
  server.get("/openapi-docs.json", (req, res) => {
    const docsDir = path.join(__dirname, "..", "doc");
    const filePath = path.join(docsDir, "/swagger.json");
    res.sendFile(filePath);
  });
}
