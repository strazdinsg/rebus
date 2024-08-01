import { z, ZodType } from "zod";
import { JwtDto } from "./jwt";
import { ChallengeDto } from "./challenge";

const Responses = <T>(dataSchema: ZodType<T>) =>
  z.object({
    status: z.enum(["SUCCESS", "ERROR"]),
    message: z.string(),
    data: dataSchema.nullable(),
  });

const AuthenticationResponseBody = Responses(JwtDto);

type AuthenticationResponseBody = z.infer<typeof AuthenticationResponseBody>;

const ChallengeResponseBody = Responses(z.array(ChallengeDto));

type ChallengeResponseBody = z.infer<typeof ChallengeResponseBody>;

export { AuthenticationResponseBody, ChallengeResponseBody };
