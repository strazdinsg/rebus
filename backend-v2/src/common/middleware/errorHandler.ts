import {
  NextFunction,
  Request as ExRequest,
  Response as ExResponse,
} from "express";
import { ValidateError } from "@tsoa/runtime";
import { HttpError } from "../types/httpError.js";
import { ERROR } from "../types/dto/httpResponse.js";

/**
 * Generic error handler for handling of all exceptions thrown by the server.
 * @param err Error object
 * @param req Request object
 * @param res Response object
 * @param next Next handler function
 */
export function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.responseCode).json({
      message: err.message,
      data: null,
      status: ERROR,
    });
  }

  next();
}
