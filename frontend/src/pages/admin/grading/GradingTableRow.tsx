import ScoreSelectBox from "./ScoreSelectBox";
import { useChallenges } from "../../../queries/challengeQueries";
import { useAllAnswers, useUpdateScore } from "../../../queries/answerQueries";
import { ShortTeamAnswerDto, TeamDto } from "../../../api-v1/models";

/**
 * One row in the grading table - for one team
 */
export function GradingTableRow(props: { team: TeamDto }) {
  const challenges = useChallenges();
  const allAnswers = useAllAnswers();
  const updateScore = useUpdateScore();
  const userId: number = props.team.id;

  if (challenges.isPending || allAnswers.isPending) {
    return renderMessage("Loading...");
  }

  if (challenges.error || allAnswers.error) {
    return renderMessage("Could not load data, contact the developer");
  }

  if (updateScore.error) {
    return renderMessage("Could not save score, contact the developer");
  }

  if (!challenges || !challenges.data) {
    return renderMessage("No challenges found");
  }

  const answerList = allAnswers.data?.data || [];
  const teamAnswers = getTeamAnswers(answerList);
  const challengeList = challenges.data?.data || [];

  return (
    <tr>
      <td>
        {props.team.name}
        <br />({getTotalScore()})
      </td>
      {challengeList.map((challenge, index) => (
        <td key={index}>
          <ScoreSelectBox
            score={getScoreForChallenge(challenge.id)}
            maxScore={challenge.maxScore}
            saveScore={(score: number | null) => saveScore(score, challenge.id)}
          />
          {getAnswerForChallenge(challenge.id)}
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers(allAnswers: ShortTeamAnswerDto[]) {
    if (allAnswers == null) return null;
    const teamAnswers = allAnswers.find(
      (answer) => answer.teamId === props.team.id
    );
    return teamAnswers || null;
  }

  function getAnswerForChallenge(challengeId: number) {
    if (teamAnswers === null) {
      return null;
    }
    const answer = teamAnswers.answers
      ? teamAnswers.answers[challengeId - 1]
      : null;
    if (answer === null) return null;

    return <p>{answer}</p>;
  }

  function getScoreForChallenge(challengeId: number): number | null {
    if (teamAnswers === null) {
      return null;
    }
    return teamAnswers.scores ? teamAnswers.scores[challengeId - 1] : null;
  }

  function saveScore(score: number | null, challengeId: number) {
    updateScore.mutate({
      challengeId: challengeId,
      userId: userId,
      score: score,
    });
  }

  function getTotalScore() {
    if (!teamAnswers || !teamAnswers.scores) {
      return 0;
    }

    return teamAnswers.scores.reduce(
      (total, current) => (total || 0) + (current || 0)
    );
  }

  function renderMessage(message: string) {
    const cl = challenges.data?.data || [];
    const columnCount = cl ? cl.length + 1 : 2;
    return (
      <tr>
        <td colSpan={columnCount}>{message}</td>
      </tr>
    );
  }
}
