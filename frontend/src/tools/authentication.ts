// Authentication stuff

import {
  deleteCookie,
  getCookie,
  getCookieOrDefault,
  setCookie,
} from "./cookies";
import { asyncApiPost } from "./requests";
import { UserSession } from "../context/UserContext";
import { JwtDto } from "schemas/src/jwt";

/**
 * Basic JWT token structure.
 */
type BasicJwt = {
  sub: string;
  roles: string[];
  jti: string; // User ID
};

/**
 * Get the currently authenticated user
 * @returns User object or null if user is not authenticated
 */
export function getAuthenticatedUser(): UserSession | null {
  let user: UserSession | null = null;
  const userIdString = getCookieOrDefault("current_user_id", "");
  const userId = userIdString ? parseInt(userIdString) : null;
  const userName = getCookieOrDefault("current_user_name", "");
  const commaSeparatedRoles = getCookie("current_user_roles");
  if (userId && commaSeparatedRoles) {
    const roles = commaSeparatedRoles.split(",");
    user = {
      id: userId,
      roles: roles,
      name: userName,
      isAdmin: false,
    };
    user.isAdmin = isAdmin(user);
  }
  return user;
}

/**
 * Check if the given user has admin rights
 * @param user
 * @returns {boolean}
 */
export function isAdmin(user: UserSession): boolean {
  return user && user.roles && user.roles.includes("ROLE_ADMIN");
}

/**
 * Send authentication request to the API
 * @param pin The user's PIN code
 * @param successCallback Function to call on success
 * @param errorCallback Function to call on error, with error code and response text as parameters
 */
export function sendAuthenticationRequest(
  pin: string,
  successCallback: (user: UserSession) => void,
  errorCallback: (errorCode: number, errorText: string) => void
) {
  const postData = {
    pin: pin,
  };
  asyncApiPost<JwtDto>("/authenticate", JwtDto, postData)
    .then((jwtResponse) => {
      onAuthSuccess(jwtResponse.jwt, successCallback);
    })
    .catch((error) => {
      const code =
        error.getErrorCode !== undefined ? error.getErrorCode() : 500;
      errorCallback(code, error.message);
    });
}

/**
 * Function called when authentication has been successful and JWT is received from the API
 * @param jwt The JSON Web token from the API
 * @param {function} callback A callback function provided by the invoker, to be called at the end
 */
function onAuthSuccess(jwt: string, callback: (user: UserSession) => void) {
  setCookie("jwt", jwt);
  const userData = parseJwtUser(jwt);
  if (userData) {
    if (userData.id) {
      setCookie("current_user_id", `${userData.id}`);
    }
    setCookie("current_user_name", userData.name);
    setCookie("current_user_roles", userData.roles.join(","));
    callback(userData);
  }
}

/**
 * Parse JWT string, extract information from it
 * Code copied from https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
 * @param token JWT token string
 * @returns {any} Decoded JWT object
 */
function parseJwt(token: string): BasicJwt {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

/**
 * Parse JWT string, extract a User object
 * @param jwtString
 * @return User object
 */
function parseJwtUser(jwtString: string): UserSession | null {
  let user: UserSession | null = null;
  const jwtObject = parseJwt(jwtString);
  if (jwtObject) {
    user = {
      id: parseInt(jwtObject.jti),
      name: jwtObject.sub,
      roles: jwtObject.roles,
      isAdmin: false,
    };
    user.isAdmin = isAdmin(user);
  }
  return user;
}

/**
 * Delete all cookies related to authorization (user session)
 */
export function deleteAuthorizationCookies() {
  deleteCookie("jwt");
  deleteCookie("current_user_id");
  deleteCookie("current_user_name");
  deleteCookie("current_user_roles");
}
