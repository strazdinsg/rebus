import { z } from "zod";

const SingleScoreDto = z.object({
  score: z.number().int("Score must be a positive integer").min(1),
});

type SingleScoreDto = z.infer<typeof SingleScoreDto>;

export { SingleScoreDto };
