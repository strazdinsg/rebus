import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "./ChallengeChoiceButton";
import "./UserDashboard.css";
import { useSelector } from "react-redux";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 * @return {JSX.Element}
 * @constructor
 */
export function UserDashboard() {
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const challenges = useSelector((state) => state.challengeStore.challenges);
  const myAnswers = useSelector((state) => state.answerStore.myAnswers);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">{user.name}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <h2>Choose a challenge</h2>
        <div id="challenge-container">
          {challenges.map((challenge, index) => (
            <ChallengeChoiceButton
              challenge={challenge}
              submitted={isAnswered(challenge.id)}
              key={index}
            />
          ))}
        </div>
      </main>
    </>
  );

  function isAnswered(challengeId) {
    let answerFound = false;
    let i = 0;
    if (myAnswers)
      while (!answerFound && i < myAnswers.length) {
        answerFound = myAnswers[i].challengeId === challengeId;
        i++;
      }
    return answerFound;
  }
}
