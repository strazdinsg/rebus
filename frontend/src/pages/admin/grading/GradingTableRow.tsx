import ScoreSelectBox from "./ScoreSelectBox";
import { useChallenges } from "../../../queries/challengeQueries";
import { useAllAnswers, useUpdateScore } from "../../../queries/answerQueries";
import { TeamDto } from "../../../api-v1/models";
import React from "react";
import { AnswerDto, TeamAnswerDto } from "../../../api-v2/models";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

/**
 * One row in the grading table - for one team
 */
export function GradingTableRow(props: { team: TeamDto }) {
  const challenges = useChallenges();
  const allAnswers = useAllAnswers();
  const updateScore = useUpdateScore();
  const userId: number = props.team.id;

  const answerList = allAnswers.data?.data || [];
  const teamAnswers = getTeamAnswers(answerList);
  const challengeList = challenges.data?.data || [];

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

  const challengeCells: ReactJSXElement[] = [];
  challengeList.forEach((challenge, index) => {
    const answer = getAnswerForChallenge(challenge.id);
    const imageUrl = answer?.imageUrl || null;
    const imageElement = imageUrl ? (
      <img src={imageUrl} alt="User-submitted" className="team-photo" />
    ) : null;
    challengeCells.push(
      <td key={index}>
        <ScoreSelectBox
          score={answer?.score || null}
          maxScore={challenge.maxScore}
          saveScore={(score: number | null) => saveScore(score, challenge.id)}
        />
        <p>{answer?.answer || ""}</p>
        {imageElement}
      </td>
    );
  });

  return (
    <tr>
      <td>
        {props.team.name}
        <br />({getTotalScore()})
      </td>
      {challengeCells}
    </tr>
  );

  function getTeamAnswers(allAnswers: TeamAnswerDto[]): TeamAnswerDto | null {
    if (allAnswers == null) return null;
    const teamAnswers = allAnswers.find(
      (answer) => answer.teamId === props.team.id
    );
    return teamAnswers || null;
  }

  function getAnswerForChallenge(challengeId: number): AnswerDto | null {
    if (teamAnswers === null) {
      return null;
    }
    const answer = teamAnswers.answers.find(
      (answer) => answer.challengeId === challengeId
    );
    return answer || null;
  }

  function saveScore(score: number | null, challengeId: number) {
    updateScore.mutate({
      challengeId: challengeId,
      userId: userId,
      score: score,
    });
  }

  function getTotalScore() {
    if (!teamAnswers?.answers) {
      return 0;
    }

    return teamAnswers.answers.reduce(
      (total, current) => (total || 0) + (current.score || 0),
      0
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
