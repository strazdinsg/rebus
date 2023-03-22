import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ChallengeChoiceButton } from "./ChallengeChoiceButton";

// TODO - load challenges from backend
const challenges = [
  {
    id: 1,
    submitted: false,
    question:
      "I am something that everyone has, yet no one can see it. I am precious, but cannot be bought. I am light as a feather, yet can weigh a person down. What am I?",
  },
  { id: 2, submitted: false, question: "Second quest" },
  { id: 3, submitted: true, question: "Another quest" },
  { id: 4, submitted: false, question: "Foursquare" },
  { id: 5, submitted: true, question: "Pentagon" },
];

/**
 * Dashboard for regular users, showing a listing of available challenges.
 * @param setSelectedChallenge A function to call to set the selected challenge
 * @return {JSX.Element}
 * @constructor
 */
export function UserDashboard({ setSelectedChallenge }) {
  const userContext = useContext(UserContext);
  const user = userContext.user;

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
            <ChallengeChoiceButton
              challenge={challenge}
              setSelectedChallenge={setSelectedChallenge}
            />
          ))}
        </div>
      </main>
    </>
  );
}
