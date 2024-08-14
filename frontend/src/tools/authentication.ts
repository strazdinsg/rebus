// Authentication stuff

import {
  deleteCookie,
  getCookie,
  getCookieOrDefault,
  setCookie,
} from "./cookies";
import { UserSession } from "../context/UserContext";
import { getPublicEndpoints } from "../api-v1/endpoints/public-endpoints/public-endpoints";
import { AuthenticationRequest } from "../api-v1/models";
import { AxiosError } from "axios";

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
  const postData: AuthenticationRequest = {
    pin: pin,
  };
  getPublicEndpoints()
    .authenticate(postData)
    .then(({ data }) => data)
    .then((jwtResponse) => {
      if (jwtResponse?.jwt) {
        onAuthSuccess(jwtResponse.jwt, successCallback);
      }
    })
    .catch((error) => {
      let code;
      if (error instanceof AxiosError) {
        code = error.response?.status || 500;
      } else {
        code = 500;
      }
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
 * Code adapted from https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
 * @param token JWT token string
 * @returns Decoded JWT object, null if JWT is malformed
 */
function parseJwt(token: string): BasicJwt | null {
  let jwt: BasicJwt | null = null;
  try {
    const parts = token.split(".");
    if (!isValidJwtFormat(parts)) {
      return null;
    }
    const jsonPayload = decodeJwtPart(parts[1]);
    jwt = jsonPayload ? JSON.parse(jsonPayload) : null;
  } catch (e) {}
  return jwt;
}

function isValidJwtFormat(parts: string[]): boolean {
  if (parts.length !== 3) {
    return false;
  }
  const [header, payload, signature] = parts;
  return isValidJwtHeaderFormat(header) && isBase64UrlFormat(signature);
}

function isBase64UrlFormat(value: string): boolean {
  const base64UrlRegex = /^[A-Za-z0-9-_]+$/;
  return base64UrlRegex.test(value);
}

function isValidJwtHeaderFormat(header: string): boolean {
  if (!isBase64UrlFormat(header)) {
    return false;
  }

  let valid: boolean;
  try {
    const decodedHeader = atob(header.replace(/-/g, "+").replace(/_/g, "/"));
    const parsedHeader = JSON.parse(decodedHeader);
    valid = typeof parsedHeader === "object" && "alg" in parsedHeader;
  } catch (e) {
    valid = false;
  }
  return valid;
}

/**
 * Decode a JWT token part
 * @param jwtPart JWT token part
 * @returns Decoded JWT part as a string, null if JWT part is malformed
 */
function decodeJwtPart(jwtPart: string): string | null {
  let decoded: string | null;
  try {
    const base64 = jwtPart.replace(/-/g, "+").replace(/_/g, "/");
    decoded = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch (e) {
    decoded = null;
  }
  return decoded;
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

///////////////////////////////////
// In-source Vitest tests
///////////////////////////////////
// @ts-ignore
if (import.meta.vitest) {
  // @ts-ignore
  const { test, expect } = import.meta.vitest;

  test("parseJwtUser returns null if jwt is malformed", () => {
    expect(
      parseJwtUser(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zzz.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).toBeNull();
    expect(
      parseJwtUser(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).toBeNull();
    expect(
      parseJwtUser(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).toBeNull();
    expect(
      parseJwtUser("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
    ).toBeNull();
    expect(
      parseJwtUser(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
      )
    ).toBeNull();
    expect(
      parseJwtUser(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ."
      )
    ).toBeNull();
  });

  test("parseJwtUser returns null if jwt is missing", () => {
    expect(parseJwtUser("")).toBeNull();
  });

  test("parseJwtUser returns valid user", () => {
    const user = parseJwtUser(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIb2ZmIiwianRpIjoiNCIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3MjM2MzI5NzMsImV4cCI6MTcyMzcxOTM3M30.qjDl3es-MzR6N-CXHA1z0U6BNV-jwPh_mOKIjGCX9qQ"
    );
    expect(user).toEqual({
      name: "Hoff",
      id: 4,
      roles: ["ROLE_USER"],
      isAdmin: false,
    });
  });

  test("parseJwtUser returns valid admin user", () => {
    const user = parseJwtUser(
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJTdHJhemRpxYZpIiwianRpIjoiMTMiLCJyb2xlcyI6WyJST0xFX1VTRVIiLCJST0xFX0FETUlOIl0sImlhdCI6MTcyMzY0MjAwOCwiZXhwIjoxNzIzNzI4NDA4fQ.cfjSfq_Dm9T_Vr1uejpMlaemMmD6aMujrS6e7Nvg0Ak"
    );
    expect(user).toEqual({
      name: "Strazdiņi",
      id: 13,
      roles: ["ROLE_USER", "ROLE_ADMIN"],
      isAdmin: true,
    });
  });
}
