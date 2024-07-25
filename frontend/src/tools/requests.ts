// All code for sending requests to backend is stored in this file

import { getCookie } from "./cookies";
import { HttpResponseError } from "./HttpResponseError";

interface HttpHeaders {
  [key: string]: string;
}

// Import REST API BASE URL from the environment variable, see .env file
// Note: all environment variables must start with REACT_, otherwise React will not handle them!
// @ts-ignore - TypeScript does not know about the environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Send an asynchronous HTTP GET request to the remote API (backend)
 * @param url Relative backend API url
 * @return {Promise<JSON>} The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiGet(url: string) {
  return asyncApiRequest("GET", url, null);
}

/**
 * Send an asynchronous HTTP GET request to the remote API (backend) and get the response as a BLOB instead of JSON
 * @param url Relative backend API url
 * @return {Promise<JSON>} The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiGetBlob(url: string): Promise<Blob> {
  return asyncApiRequest("GET", url, null, true) as Promise<Blob>;
}

/**
 * Send an asynchronous HTTP POST request to the remote API (backend)
 * @param url Relative backend API url
 * @param requestBody The parameters to include in the request body
 * @return {Promise<JSON>} The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiPost(
  url: string,
  requestBody: object | null
): Promise<JSON> {
  return asyncApiRequest("POST", url, requestBody) as Promise<JSON>;
}

/**
 * Upload a file as multipart form data to the backend, using HTTP POST
 * @param {string} url Relative backend API url
 * @param fileContent The content of the file to upload
 * @return {Promise<JSON>} The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiPostFile(
  url: string,
  fileContent: File
): Promise<JSON> {
  return asyncApiRequest(
    "POST",
    url,
    null,
    false,
    fileContent
  ) as Promise<JSON>;
}

/**
 * Send an asynchronous HTTP DELETE request to the remote API (backend)
 * @param url Relative backend API url
 * @param requestBody The parameters to include in the request body
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiDelete(
  url: string,
  requestBody: object
): Promise<JSON> {
  return asyncApiRequest("DELETE", url, requestBody) as Promise<JSON>;
}

/**
 * Send and asynchronous request to the remote API.
 * Add the JWT token automatically (if one is available).
 * @param method the HTTP method to use: GET, POST, PUT. Case-insensitive.
 * @param url The relative API url (base URL is added automatically)
 * @param requestBody The data to send in request body. Ignored for HTTP GET.
 * @param returnBlob When true, return the response as a Blob instead of JSON
 * @param fileContent Content of a file to upload.
 * Note: fileContent is only considered when requestBody is not specified!
 * @return @return {Promise<JSON>} The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
async function asyncApiRequest(
  method: string,
  url: string,
  requestBody: object | null = null,
  returnBlob: boolean = false,
  fileContent: File | null = null
): Promise<JSON | Blob> {
  const fullUrl: string = API_BASE_URL + url;
  let headers: HttpHeaders = createAuthenticationHeader();
  let body = null;
  if (method.toLowerCase() !== "get" && requestBody) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(requestBody);
  } else if (fileContent) {
    body = new FormData();
    body.append("fileContent", fileContent);
  }

  return fetch(fullUrl, {
    method: method,
    mode: "cors",
    headers: headers,
    body: body,
  })
    .then(handleErrors)
    .then((response: Response) =>
      returnBlob ? response.blob() : response.json()
    );
}

/**
 * Get HTTP request headers with authentication info, if it is available
 * @return {object} Header object, which will include an "Authorization" header,
 * if JWT token is available.
 */
function createAuthenticationHeader(): HttpHeaders {
  let headers: HttpHeaders = {};
  const jwtToken = getCookie("jwt");
  if (jwtToken) {
    headers["Authorization"] = "Bearer " + jwtToken;
  }
  return headers;
}

/**
 * Check whether the HTTP response has a 200 OK status. If it does, return the
 * response. If it does not, throw an Error
 * @param response
 * @return The response (if all was OK)
 * @throws Error containing the response code and text from the response body
 */
async function handleErrors(response: Response) {
  if (!response.ok) {
    const responseText = await response.text();
    throw new HttpResponseError(response.status, responseText);
  }
  return response;
}
