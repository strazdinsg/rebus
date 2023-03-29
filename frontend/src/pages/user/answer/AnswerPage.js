import "./AnswerPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ImageUploader } from "./ImageUploader";
import { AnswerContext } from "../../../context/AnswerContext";
import { useSelector } from "react-redux";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @returns {JSX.Element}
 * @constructor
 */
export function AnswerPage() {
  const { challengeId } = useParams();
  const challenges = useSelector((state) => state.challengeStore.challenges);
  const challenge = getSelectedChallenge(challenges, challengeId);
  const answerContext = useContext(AnswerContext);
  const myAnswers = answerContext.answers;
  const submittedAnswer = myAnswers.find(
    (answer) => answer.challengeId === parseInt(challengeId)
  );
  const submittedAnswerText =
    submittedAnswer != null ? submittedAnswer.answer : "";
  const [answer, setAnswer] = useState(submittedAnswerText);
  const [errorText, setErrorText] = useState("");
  const submissionEnabled = !!answer;
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
        <div id="answer-container">
          <p>{challenge.question}</p>
          <TextField
            id="answer-input-field"
            label="Your answer"
            placeholder="Your answer here"
            type="text"
            error={hasError}
            helperText={errorText}
            multiline={true}
            onChange={(event) => setAnswer(event.target.value)}
            value={answer}
          />
          <ImageUploader />
          <Button
            variant="contained"
            onClick={submitAnswer}
            disabled={!submissionEnabled}
          >
            Send
          </Button>
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

  function submitAnswer() {
    setErrorText("Not implemented");
    console.log("Setting error");
  }
}
