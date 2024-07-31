import { useDispatch, useSelector } from "react-redux";
import ScoreSelectBox from "./ScoreSelectBox";
import { useEffect } from "react";
import { apiGetImage, apiPostScore } from "../../../tools/api";
import { updateScore } from "../../../redux/answerSlice";
import { RootState } from "../../../redux/store";
import { TeamDto } from "schemas/src/team";
import { ShortTeamAnswersDto } from "schemas/src/answer";
import { useChallenges } from "../../../queries/challengeQueries";

/**
 * One row in the grading table - for one team
 */
export function GradingTableRow(props: { team: TeamDto }) {
  const { isPending, error, data: challenges } = useChallenges();
  const teamAnswers = useSelector((state: RootState) =>
    getTeamAnswers(state.answerStore.allAnswers)
  );
  const dispatch = useDispatch();

  if (isPending) {
    return renderMessage("Loading challenges...");
  }

  if (error) {
    return renderMessage("Could not load challenges, contact the developer");
  }

  if (!challenges) {
    return renderMessage("No challenges found");
  }

  return (
    <tr>
      <td>
        {props.team.name}
        <br />({getTotalScore()})
      </td>
      {challenges.map((challenge, index) => (
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

  function getTeamAnswers(allAnswers: ShortTeamAnswersDto[]) {
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
    const answer = teamAnswers.answers[challengeId - 1];
    if (answer === null) return null;

    return <p>{answer}</p>;
  }

  function getScoreForChallenge(challengeId: number): number | null {
    if (teamAnswers === null) {
      return null;
    }
    return teamAnswers.scores[challengeId - 1];
  }

  function saveScore(score: number | null, challengeId: number) {
    apiPostScore(challengeId, props.team.id, score)
      .then((response) =>
        dispatch(
          updateScore({
            challengeId: challengeId,
            userId: props.team.id,
            score: score,
          })
        )
      )
      .catch((error) => console.error(error));
  }

  function getTotalScore() {
    if (!teamAnswers) return 0;

    return teamAnswers.scores.reduce(
      (total, current) => (total || 0) + (current || 0)
    );
  }

  function renderMessage(message: string) {
    return <tr>{message}</tr>;
  }
}
