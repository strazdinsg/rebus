import { z, ZodType } from "zod";

export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

/**
 * A function which creates a generic Zod schema for a response body.
 * The schema will contain a status field, which can be SUCCESS or ERROR.
 * The data field will be nullable. The message field will always be a string, but can be empty.
 * @param dataSchema The Zod schema for the data field
 * @constructor
 */
export const ResponseBody = <T>(dataSchema: ZodType<T>) =>
  z.object({
    status: z.enum([SUCCESS, ERROR]),
    message: z.string(),
    data: dataSchema.nullable(),
  });

/**
 * Check whether the response status is Error
 * @param responseBody The response body to check
 * @return True if the response status is Error
 */
export function isError(responseBody: { status: string }) {
  return responseBody.status === ERROR;
}
