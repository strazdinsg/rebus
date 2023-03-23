import "./AnswerPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { ChallengeContext } from "../../../context/ChallengeContext";
import TextField from "@mui/material/TextField";
import {
  AppBar,
  Button,
  IconButton,
  Input,
  Toolbar,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @returns {JSX.Element}
 * @constructor
 */
export function AnswerPage() {
  const { challengeId } = useParams();
  const allChallenges = useContext(ChallengeContext);
  const challenge = getSelectedChallenge(allChallenges, challengeId);
  const [errorText, setErrorText] = useState("");
  const hasError = !!errorText;
  const navigate = useNavigate();

  if (challenge == null) {
    return <main>Loading challenge data...</main>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Challenge {challenge.id}</Typography>
        </Toolbar>
      </AppBar>
      <main>
        <p>{challenge.question}</p>
        <div id="answer-container">
          <TextField
            id="answer-input-field"
            label="Your answer"
            placeholder="Your answer here"
            type="text"
            error={hasError}
            helperText={errorText}
          />
          {/*TODO - style the image uploader*/}
          <Input type="file" inputProps={{ accept: "image/*" }}></Input>
          <Button variant="contained">Send</Button>
        </div>
      </main>
    </>
  );

  function getSelectedChallenge(challenges, id) {
    const integerId = parseInt(id);
    return challenges.find((challenge) => challenge.id === integerId);
  }

  function goBack() {
    navigate(-1);
  }
}
