// All code for sending requests to backend is stored in this file

import { getCookie } from "./cookies";
import { HttpResponseError } from "./HttpResponseError";
import { ZodError, ZodSchema } from "zod";

interface HttpHeaders {
  [key: string]: string;
}

// Import REST API BASE URL from the environment variable, see .env file
// Note: all environment variables must start with VITE_, otherwise Vite will not handle them!
// @ts-ignore - TypeScript does not know about the environment variable
export const API_V1_BASE_URL = import.meta.env.VITE_API_V1_BASE_URL;
// @ts-ignore - TypeScript does not know about the environment variable
export const API_V2_BASE_URL = import.meta.env.VITE_API_V2_BASE_URL;

/**
 * Send an asynchronous HTTP GET request to the remote API (backend)
 * @param url Relative backend API url
 * @param schema The Zod schema to validate the response against
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiGet<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  return await asyncApiRequest("GET", url, null, null, false, schema);
}

/**
 * Send an asynchronous HTTP GET request to the remote API, version 2 (backend)
 * @param url Relative backend API url
 * @param schema The Zod schema to validate the response against
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiGetV2<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  return await asyncApiRequest("GET", url, null, null, true, schema);
}

/**
 * Send an asynchronous HTTP GET request to the remote API (backend) and get the response as a BLOB instead of JSON
 * @param url Relative backend API url
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiGetBlob(url: string): Promise<Blob> {
  return await asyncApiRequestBlob("GET", url, null, null);
}

/**
 * Send an asynchronous HTTP POST request to the remote API (backend)
 * @param url Relative backend API url
 * @param schema The Zod schema to validate the response against
 * @param requestBody The parameters to include in the request body
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiPost<T>(
  url: string,
  schema: ZodSchema<T>,
  requestBody: object | string | null
): Promise<T> {
  return await asyncApiRequest("POST", url, requestBody, null, false, schema);
}

/**
 * Upload a file as multipart form data to the backend, using HTTP POST
 * @param {string} url Relative backend API url
 * @param fileContent The content of the file to upload
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
export async function asyncApiPostFile<T>(
  url: string,
  fileContent: File
): Promise<T> {
  return await asyncApiRequest("POST", url, null, fileContent);
}

/**
 * Send and asynchronous request to the remote API.
 * Add the JWT token automatically (if one is available).
 * @param method the HTTP method to use: GET, POST, PUT. Case-insensitive.
 * @param url The relative API url (base URL is added automatically)
 * @param requestBody The data to send in request body. Ignored for HTTP GET.
 * @param fileContent Content of a file to upload.
 * Note: fileContent is only considered when requestBody is not specified!
 * @param api_version2 When true, use the API version 2 (Node.js Express)
 * @param schema The Zod schema to validate the response against
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
async function asyncApiRequest<T>(
  method: string,
  url: string,
  requestBody: object | string | null = null,
  fileContent: File | null = null,
  api_version2: boolean = false,
  schema: ZodSchema<T> | null = null
): Promise<T> {
  const response: Response = await sendRequest(
    method,
    url,
    requestBody,
    fileContent,
    api_version2
  ).then(handleErrors);

  const bodyJson: T = await response.json();
  if (schema) {
    schema.parse(bodyJson);
  }
  return bodyJson;
}

/**
 * Send and asynchronous request to the remote API, get a Blob response.
 * Add the JWT token automatically (if one is available).
 * @param method the HTTP method to use: GET, POST, PUT. Case-insensitive.
 * @param url The relative API url (base URL is added automatically)
 * @param requestBody The data to send in request body. Ignored for HTTP GET.
 * @param fileContent Content of a file to upload.
 * Note: fileContent is only considered when requestBody is not specified!
 * @param api_version2 When true, use the API version 2 (Node.js Express)
 * @return The response body, parsed as a JSON
 * @throws {HttpResponseError} Error code and message from the response body
 */
async function asyncApiRequestBlob(
  method: string,
  url: string,
  requestBody: object | null = null,
  fileContent: File | null = null,
  api_version2: boolean = false
): Promise<Blob> {
  const response: Response = await sendRequest(
    method,
    url,
    requestBody,
    fileContent,
    api_version2
  ).then(handleErrors);

  return response.blob();
}

async function sendRequest(
  method: string,
  url: string,
  requestBody: object | string | null = null,
  fileContent: File | null = null,
  api_version2: boolean = false
): Promise<Response> {
  const baseUrl = api_version2 ? API_V2_BASE_URL : API_V1_BASE_URL;
  const fullUrl: string = baseUrl + url;

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
  }).then(handleErrors);
}

/**
 * Get HTTP request headers with authentication info, if it is available
 * @return Header object, which will include an "Authorization" header,
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
