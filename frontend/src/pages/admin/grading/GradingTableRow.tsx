import { useDispatch, useSelector } from "react-redux";
import ScoreSelectBox from "./ScoreSelectBox";
import { useEffect } from "react";
import { apiGetImage, apiPostScore } from "../../../tools/api";
import { ShortTeamAnswers, updateScore } from "../../../redux/answerSlice";
import { RootState } from "../../../redux/store";
import { Team } from "../../../redux/teamSlice";

/**
 * One row in the grading table - for one team
 */
export function GradingTableRow(props: { team: Team }) {
  const challenges = useSelector(
    (state: RootState) => state.challengeStore.challenges
  );
  const teamAnswers = useSelector((state: RootState) =>
    getTeamAnswers(state.answerStore.allAnswers)
  );
  const dispatch = useDispatch();

  // Ignore the warning about dependencies
  // eslint-disable-next-line
  useEffect(loadImages, []);

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
          <img
            className="team-photo"
            alt="User-submitted"
            id={getImageId(props.team.id, challenge.id)}
          />
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers(allAnswers: ShortTeamAnswers[]) {
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

  function loadImages() {
    console.log("Loading images...");
    for (let challengeIndex in challenges) {
      const challengeId = challenges[challengeIndex].id;
      apiGetImage(challengeId, props.team.id)
        .then((imageBlob) => showImage(imageBlob, challengeId))
        .catch((_) => {});
    }
  }

  function getImageId(teamId: number, challengeId: number) {
    return `answer-img-${challengeId}-${teamId}`;
  }

  function showImage(imageBlob: Blob, challengeId: number) {
    const imageElement = document.getElementById(
      getImageId(props.team.id, challengeId)
    ) as HTMLImageElement;
    if (imageElement && imageBlob) {
      imageElement.src = URL.createObjectURL(imageBlob);
      imageElement.style.display = "block";
    } else {
      imageElement.style.display = "none";
    }
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
}
