import { TeamAnswerDto } from "../../common/types/dto/teamAnswerDto";
import { AnswerDto } from "../../common/types/dto/answerDto";
import { Answer } from "../../database/model/answer";

/**
 * Service for the answers.
 */
class AnswerService {
  /**
   * Retrieves all answers from the database.
   *
   * @returns A promise that resolves with an array of TeamAnswerDto objects.
   * @throws The promise rejects with an error if the database query fails.
   */
  async getAll(): Promise<TeamAnswerDto[]> {
    const ungroupedAnswers: Answer[] = await Answer.findAll();
    let teamAnswers: TeamAnswerDto[] = [];
    for (const answer of ungroupedAnswers) {
      _appendAnswerToTeamAnswers(teamAnswers, answer);
    }
    return teamAnswers;
  }

  /**
   * Retrieves answers for a specific team.
   * @param teamId ID of the team
   * @returns A promise that resolves with an object containing the team ID and the answers for the team.
   * @throws The promise rejects with an error if the database query fails.
   */
  async getAnswersForTeam(teamId: number): Promise<TeamAnswerDto> {
    // Get current user ID
    const answers: Answer[] = await Answer.findAll({
      where: { userId: teamId },
    });
    return {
      teamId: teamId,
      answers: answers.map(_convertToDtoWithoutScore),
    };
  }

  /**
   * Saves an answer for a specific challenge. Creates a new answer if it doesn't exist.
   * @param challengeId
   * @param userId
   * @param answer
   * @returns A promise that resolves when the answer is saved.
   * @throws The promise rejects with an error if the database query fails.
   */
  async saveAnswer(
    challengeId: number,
    userId: number,
    answer: string
  ): Promise<void> {
    await Answer.upsert({
      challengeId: challengeId,
      userId: userId,
      answer: answer,
    });
  }
}

function _appendAnswerToTeamAnswers(
  teamAnswers: TeamAnswerDto[],
  answer: Answer
) {
  const answerDto: AnswerDto = {
    challengeId: answer.challengeId,
    answer: answer.answer,
    score: answer.score,
    imageUrl: answer.imageUrl,
  };
  const teamAnswer = teamAnswers.find(
    (teamAnswer) => teamAnswer.teamId === answer.userId
  );
  if (teamAnswer) {
    teamAnswer.answers.push(answerDto);
  } else {
    teamAnswers.push({
      teamId: answer.userId,
      answers: [answerDto],
    });
  }
}

function _convertToDtoWithoutScore(answer: Answer): AnswerDto {
  return {
    challengeId: answer.challengeId,
    answer: answer.answer,
    score: null,
    imageUrl: answer.imageUrl,
  };
}

export const answerService = new AnswerService();
