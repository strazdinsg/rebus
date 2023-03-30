import { useDispatch, useSelector } from "react-redux";
import { ScoreSelectBox } from "./ScoreSelectBox";
import { useEffect } from "react";
import { apiGetImage, apiPostScore } from "../../../tools/api";
import { updateScore } from "../../../redux/answerSlice";

/**
 * One row in the grading table - for one team
 * @param team The team represented in the row
 * @return {JSX.Element}
 * @constructor
 */
export function GradingTableRow({ team }) {
  const challenges = useSelector((state) => state.challengeStore.challenges);
  const teamAnswers = useSelector((state) =>
    getTeamAnswers(state.answerStore.allAnswers)
  );
  const dispatch = useDispatch();

  // Ignore the warning about dependencies
  // eslint-disable-next-line
  useEffect(loadImages, []);

  return (
    <tr>
      <td>
        {team.name}
        <br />({getTotalScore()})
      </td>
      {challenges.map((challenge, index) => (
        <td key={index}>
          <ScoreSelectBox
            score={getScoreForChallenge(challenge.id)}
            maxScore={challenge.maxScore}
            saveScore={(score) => saveScore(score, challenge.id)}
          />
          {getAnswerForChallenge(challenge.id)}
          <img
            className="team-photo"
            alt="User-submitted"
            id={getImageId(team.id, challenge.id)}
          />
        </td>
      ))}
    </tr>
  );

  function getTeamAnswers(allAnswers) {
    if (allAnswers == null) return null;
    const teamAnswers = allAnswers.find((answer) => answer.teamId === team.id);
    return teamAnswers || null;
  }

  function getAnswerForChallenge(challengeId) {
    if (teamAnswers === null) {
      return null;
    }
    const answer = teamAnswers.answers[challengeId - 1];
    if (answer === null) return null;

    return <p>{answer}</p>;
  }

  function getScoreForChallenge(challengeId) {
    if (teamAnswers === null) {
      return null;
    }
    return teamAnswers.scores[challengeId - 1];
  }

  function loadImages() {
    console.log("Loading images...");
    for (let challengeIndex in challenges) {
      const challengeId = challenges[challengeIndex].id;
      apiGetImage(challengeId, team.id)
        .then((imageBlob) => showImage(imageBlob, challengeId))
        .catch((_) => {});
    }
  }

  function getImageId(teamId, challengeId) {
    return `answer-img-${challengeId}-${teamId}`;
  }

  function showImage(imageBlob, challengeId) {
    const imageElement = document.getElementById(
      getImageId(team.id, challengeId)
    );
    if (imageBlob) {
      imageElement.src = URL.createObjectURL(imageBlob);
      imageElement.style.display = "block";
    } else {
      imageElement.style.display = "none";
    }
  }

  function saveScore(score, challengeId) {
    if (score < 0) {
      score = null;
    }
    apiPostScore(challengeId, team.id, score)
      .then((response) =>
        dispatch(
          updateScore({
            challengeId: challengeId,
            userId: team.id,
            score: score,
          })
        )
      )
      .catch((error) => console.error(error));
  }

  function getTotalScore() {
    if (!teamAnswers) return 0;

    return teamAnswers.scores.reduce((total, current) => total + current);
  }
}
