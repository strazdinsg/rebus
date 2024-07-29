import {z} from "zod";


const AnswerDto = z.object({
    challengeId: z.number().int("ID must be an integer"),
    answer: z.string(),
    score: z.number().int("Score must be an integer or null").min(1).nullable(),
});

type AnswerDto = z.infer<typeof AnswerDto>;

const MyAnswerDto = z.object({
    challengeId: z.number().int("ID must be an integer"),
    answer: z.string(),
});

type MyAnswerDto = z.infer<typeof MyAnswerDto>;

const TeamAnswersDto = z.object({
    teamId: z.number().int("ID must be an integer"),
    answers: z.array(AnswerDto),
});

type TeamAnswersDto = z.infer<typeof TeamAnswersDto>;

const ShortTeamAnswersDto = z.object({
    teamId: z.number().int("Team ID must be an integer"),
    answers: z.array(z.string().nullable()),
    scores: z.array(z.number().int("Score must be an integer or null").nullable()),
});

type ShortTeamAnswersDto = z.infer<typeof ShortTeamAnswersDto>;


export {AnswerDto, MyAnswerDto, TeamAnswersDto, ShortTeamAnswersDto};