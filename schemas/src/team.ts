import { z } from "zod";

const TeamDto = z.object({
  id: z.number().int("ID must be an integer"),
  name: z.string(),
});

type TeamDto = z.infer<typeof TeamDto>;

export { TeamDto };
