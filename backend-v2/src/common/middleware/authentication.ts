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
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    return await _authenticateWithJwt(request, scopes);
  }
  throw new Error("Unknown security method: " + securityName);
}

async function _authenticateWithJwt(
  request: express.Request,
  scopes: string[] | undefined
) {
  let token: JwtPayload = await _getTokenFromRequest(request);
  const userId = await _getTokenUserId(token);
  const authorized = _containsRequiredScopes(token, scopes);
  if (authorized) {
    _storeUserInSession(userId, request);
  } else {
    return Promise.reject(
      new HttpError(FORBIDDEN, "JWT does not contain required scope.")
    );
  }
  return token;
}

async function _getTokenFromRequest(
  request: express.Request
): Promise<JwtPayload> {
  let tokenString = _getTokenFromBearerHeader(request);
  if (!tokenString) {
    tokenString = _getTokenFromCookie(request);
  }
  if (!tokenString) {
    throw new HttpError(UNAUTHORIZED, "No token provided");
  }
  return await _verifyJwt(tokenString);
}

function _getTokenFromBearerHeader(request: express.Request): string | null {
  let tokenString: string | null = null;
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    tokenString = authHeader.substring("Bearer ".length);
  }
  return tokenString;
}

function _getTokenFromCookie(request: express.Request): string | null {
  return _getCookie(request, "jwt");
}

async function _verifyJwt(jwtString: string): Promise<JwtPayload> {
  if (!secretKey) {
    return Promise.reject(
      new HttpError(UNAUTHORIZED, "Can't validate tokens (key)")
    );
  }
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(jwtString, secretKey, (err, decoded) => {
      if (err) {
        reject(new HttpError(UNAUTHORIZED, "Invalid token"));
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}

async function _getTokenUserId(token: JwtPayload): Promise<number> {
  if (!token.jti) {
    throw new HttpError(UNAUTHORIZED, "No user ID in token");
  }
  return parseInt(token.jti);
}

function _containsRequiredScopes(
  token: JwtPayload,
  requiredScopes: string[] | undefined
): boolean {
  if (!requiredScopes) {
    return true;
  }
  const unsatisfiedScope = requiredScopes.find(
    (scope) => !token.roles.includes(scope)
  );
  return !unsatisfiedScope;
}

/**
 * Stores the current user in the session (request).
 * @param userId ID of the user (team)
 * @param request Request object
 */
function _storeUserInSession(userId: number, request: express.Request) {
  request.sessionUserId = userId;
}

function _getCookie(
  request: express.Request,
  cookieName: string
): string | null {
  const cookieString = request.headers.cookie;
  if (!cookieString) {
    return null;
  }
  const cookies = cookieString.split(";");
  for (const cookie of cookies) {
    let [name, value] = cookie.split("=");
    name = name.trim();
    value = value.trim();
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}
