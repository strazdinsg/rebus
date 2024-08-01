import { z, ZodType } from "zod";
import { JwtDto } from "./jwt";

const Responses = <T>(dataSchema: ZodType<T>) =>
  z.object({
    status: z.enum(["SUCCESS", "ERROR"]),
    message: z.string(),
    data: dataSchema,
  });

const AuthenticationResponseBody = Responses(JwtDto);

type AuthenticationResponseBody = z.infer<typeof AuthenticationResponseBody>;

export { AuthenticationResponseBody };
