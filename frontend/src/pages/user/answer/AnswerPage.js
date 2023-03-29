import "./AnswerPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ImageUploader } from "./ImageUploader";
import { useSelector } from "react-redux";
import { UserContext } from "../../../context/UserContext";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @returns {JSX.Element}
 * @constructor
 */
export function AnswerPage() {
  const { challengeId } = useParams();
  const challenges = useSelector((state) => state.challengeStore.challenges);
  const challenge = getSelectedChallenge(challenges, challengeId);
  const myAnswers = useSelector((state) => state.answerStore.myAnswers);
  const pictureToUpload = useSelector(
    (state) => state.pictureStore.pictureToUpload
  );
  const user = useContext(UserContext).user;
  const userId = user !== null ? user.id : null;

  const submittedAnswer =
    myAnswers === null
      ? null
      : myAnswers.find(
          (answer) => answer.challengeId === parseInt(challengeId)
        );
  const submittedAnswerText =
    submittedAnswer != null ? submittedAnswer.answer : "";

  const [updatedAnswer, setUpdatedAnswer] = useState(
    submittedAnswerText !== "" ? submittedAnswerText : null
  );
  const [errorText, setErrorText] = useState("");
  const submissionEnabled = !!updatedAnswer;
  const hasError = !!errorText;
  const navigate = useNavigate();

  if (challenge == null) {
    return <main>Loading challenge data...</main>;
  }

  if (updatedAnswer === null && submittedAnswerText !== "") {
    setUpdatedAnswer(submittedAnswerText);
  }

  if (pictureToUpload !== null) {
    console.log("Uploadable picture is set!");
    console.log(pictureToUpload.substring(0, 60));
  } else {
    console.log("Uploadable picture is empty");
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
            onChange={(event) => setUpdatedAnswer(event.target.value)}
            value={updatedAnswer || ""}
          />
          <ImageUploader challengeId={challengeId} userId={userId} />
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
  }
}
