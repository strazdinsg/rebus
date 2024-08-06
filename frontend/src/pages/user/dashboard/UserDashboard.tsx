import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "./ChallengeChoiceButton";
import "./UserDashboard.css";
import { useChallenges } from "../../../queries/challengeQueries";
import { useMyAnswers } from "../../../queries/answerQueries";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 */
export function UserDashboard() {
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const challenges = useChallenges();
  const myAnswers = useMyAnswers();

  if (!user || challenges.isPending || myAnswers.isPending) {
    return <main>Loading...</main>;
  }

  if (challenges.error || myAnswers.error) {
    return <main>Data error, contact the developer</main>;
  }

  if (!challenges || !challenges.data) {
    return <main>No challenges found</main>;
  }

  const challengeList = challenges.data?.data || [];
  const myAnswerList = myAnswers.data?.data.data?.answers || [];

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
          {challengeList.map((challenge, index) => (
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

  function isAnswered(challengeId: number) {
    let answerFound = false;
    if (myAnswers.data) {
      let i = 0;
      while (!answerFound && i < myAnswerList.length) {
        answerFound = myAnswerList[i].challengeId === challengeId;
        i++;
      }
    }
    return answerFound;
  }
}
