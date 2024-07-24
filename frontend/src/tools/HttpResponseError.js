/**
 * An exception to be used for HTTP error responses
 */
export class HttpResponseError extends Error {
  /**
   * Create a new HTTP response error
   * @param {int} statusCode The Status code: 200 for OK, 404 for Not found, etc.
   * @param {string} message The message in the response body
   */
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  /**
   * @return {int} The HTTP error code (401 unauthorized, etc)
   */
  getErrorCode() {
    return this.statusCode;
  }
}
