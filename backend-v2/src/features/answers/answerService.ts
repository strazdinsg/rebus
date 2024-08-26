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
}

// TODO - test this function
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

export const answerService = new AnswerService();
