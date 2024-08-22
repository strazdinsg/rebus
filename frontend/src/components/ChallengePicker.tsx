import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "../pages/user/dashboard/ChallengeChoiceButton";
import React from "react";
import "./ChallengePicker.css";
import { UserSession } from "../context/UserContext";
import { ChallengeDto, TeamAnswerDto } from "../api-v2/models";
import { QueryResult } from "../tools/queryTools";

/**
 * Props for the ChallengePicker component.
 */
type ChallengePickerProps = {
  user: UserSession | null;
  challenges: QueryResult<ChallengeDto[]>;
  myAnswers: QueryResult<TeamAnswerDto>;
  /**
   * Callback when a challenge is picked.
   * @param challengeId The ID of the challenge that was picked.
   */
  onPick: (challengeId: number) => void;
};

/**
 * Component for selecting a challenge.
 * @constructor
 */
export function ChallengePicker(props: ChallengePickerProps) {
  if (!props.user || props.challenges.isPending || props.myAnswers.isPending) {
    return <main>Loading...</main>;
  }

  if (props.challenges.error || props.myAnswers.error) {
    return <main>Data error, contact the developer</main>;
  }

  if (
    !props.challenges ||
    !props.challenges.data ||
    props.challenges.data.length === 0
  ) {
    return <main>No challenges found</main>;
  }

  const challengeList = props.challenges.data || [];
  const myAnswerList = props.myAnswers.data?.answers || [];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">{props.user.name}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <h2>Choose a challenge</h2>
        <div id="challenge-container">
          {challengeList.map((challenge, index) => (
            <ChallengeChoiceButton
              challenge={challenge}
              submitted={isAnswered(challenge.id)}
              key={index}
              onClick={props.onPick}
            />
          ))}
        </div>
      </main>
    </>
  );

  function isAnswered(challengeId: number) {
    let answerFound = false;
    if (props.myAnswers.data) {
      let i = 0;
      while (!answerFound && i < myAnswerList.length) {
        answerFound = myAnswerList[i].challengeId === challengeId;
        i++;
      }
    }
    return answerFound;
  }
}
