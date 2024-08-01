import { z, ZodType } from "zod";

export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

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
