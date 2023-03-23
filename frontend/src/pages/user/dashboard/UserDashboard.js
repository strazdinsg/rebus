import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "./ChallengeChoiceButton";
import { ChallengeContext } from "../../../context/ChallengeContext";
import "./UserDashboard.css";

/**
 * Dashboard for regular users, showing a listing of available challenges.
 * @return {JSX.Element}
 * @constructor
 */
export function UserDashboard() {
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const challenges = useContext(ChallengeContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">{user.username}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <h2>Choose a challenge</h2>
        <div id="challenge-container">
          {challenges.map((challenge, index) => (
            <ChallengeChoiceButton challenge={challenge} key={index} />
          ))}
        </div>
      </main>
    </>
  );
}
