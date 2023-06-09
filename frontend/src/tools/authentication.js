// Authentication stuff

import { deleteCookie, getCookie, setCookie } from "./cookies";
import { asyncApiPost } from "./requests";

/**
 * Get the currently authenticated user
 * @returns User object or null if user is not authenticated
 */
export function getAuthenticatedUser() {
  let user = null;
  const userId = getCookie("current_user_id");
  const userName = getCookie("current_user_name");
  const commaSeparatedRoles = getCookie("current_user_roles");
  if (userId && commaSeparatedRoles) {
    const roles = commaSeparatedRoles.split(",");
    user = {
      id: userId,
      roles: roles,
      name: userName,
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
export function isAdmin(user) {
  return user && user.roles && user.roles.includes("ROLE_ADMIN");
}

/**
 * Send authentication request to the API
 * @param pin The user's PIN code
 * @param successCallback Function to call on success
 * @param errorCallback Function to call on error, with error code and response text as parameters
 */
export function sendAuthenticationRequest(pin, successCallback, errorCallback) {
  const postData = {
    pin: pin,
  };
  asyncApiPost("/authenticate", postData)
    .then((jwtResponse) => {
      onAuthSuccess(jwtResponse, successCallback);
    })
    .catch((error) => {
      const code =
        error.getErrorCode !== undefined ? error.getErrorCode() : 500;
      errorCallback(code, error.message);
    });
}

/**
 * Function called when authentication has been successful and JWT is received from the API
 * @param {object} jwtResponse The HTTP response from the API, contains an object with `jwt` property
 * @property jwt JWT token, as a string
 * @param {function} callback A callback function provided by the invoker, to be called at the end
 */
function onAuthSuccess(jwtResponse, callback) {
  setCookie("jwt", jwtResponse.jwt);
  const userData = parseJwtUser(jwtResponse.jwt);
  if (userData) {
    setCookie("current_user_id", userData.id);
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
function parseJwt(token) {
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
function parseJwtUser(jwtString) {
  let user = null;
  const jwtObject = parseJwt(jwtString);
  if (jwtObject) {
    user = {
      id: jwtObject.jti,
      name: jwtObject.sub,
      roles: jwtObject.roles,
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
