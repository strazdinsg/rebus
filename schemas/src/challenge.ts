import {z} from "zod";

/**
 * Challenge DTO.
 * @property id ID of the challenge
 * @property question Question to be answered
 * @property maxScore Maximum score for the challenge
 */
const ChallengeDto = z.object({
    id: z.number().int("ID must be an integer"),
    question: z.string(),
    maxScore: z.number().int("Max score must be an integer"),
});

type ChallengeDto = z.infer<typeof ChallengeDto>;

export {ChallengeDto};