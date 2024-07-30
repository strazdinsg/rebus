import { z } from "zod";

const JwtDto = z.object({
  jwt: z.string(),
});

type JwtDto = z.infer<typeof JwtDto>;

export { JwtDto };
