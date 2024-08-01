// CORS configuration for the Express server

import { CorsOptions } from "cors";
import { loadEnvironmentVariables } from "./environment.js";

loadEnvironmentVariables();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

/**
 * CORS configuration for the Express server.
 */
export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
