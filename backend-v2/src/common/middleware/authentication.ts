import express from "express";
import * as jwt from "jsonwebtoken";
import { loadEnvironmentVariables } from "../utils/environment";
import { JwtPayload } from "jsonwebtoken";
import { HttpError } from "../types/httpError";
import { FORBIDDEN, UNAUTHORIZED } from "../types/dto/httpResponse";

loadEnvironmentVariables();

const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
  console.error("No JWT secret key provided in the .env file!");
}

/**
 * Middleware function for authentication.
 * @param request Request object
 * @param securityName Name of the security method (in tsoa decorator @Security)
 * @param scopes List of required scopes (in tsoa decorator @Security)
 */
export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    let token = getTokenFromRequest(request);
    return new Promise<any>((resolve, reject) => {
      if (!token) {
        reject(new HttpError(UNAUTHORIZED, "No token provided"));
      } else if (!secretKey) {
        reject(new HttpError(UNAUTHORIZED, "Can't validate tokens (key)"));
      } else {
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            reject(err);
          } else if (scopes) {
            // Check if JWT contains all required scopes
            const decodedJwt: JwtPayload = decoded as JwtPayload;
            for (let scope of scopes) {
              if (!decodedJwt.roles.includes(scope)) {
                reject(
                  new HttpError(
                    FORBIDDEN,
                    "JWT does not contain required scope."
                  )
                );
              }
            }
          }
          resolve(decoded);
        });
      }
    });
  }
  throw new Error("Unknown security method: " + securityName);
}

function getTokenFromRequest(request: express.Request): string | null {
  let token = null;
  const authHeader = request.headers.authorization;
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring("Bearer ".length);
      console.log("Bearer token: " + token);
    }
  }
  return token;
}
