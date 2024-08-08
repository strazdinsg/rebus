/**
 * HTTP error.
 */
export class HttpError extends Error {
  responseCode: number;

  /**
   * Constructor.
   * @param status HTTP status code.
   * @param message Error message.
   */
  constructor(status: number, message: string) {
    super(message);
    this.responseCode = status;
  }
}
