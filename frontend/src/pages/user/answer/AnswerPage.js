import "./AnswerPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ImageUploader } from "./ImageUploader";
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../../../context/UserContext";
import { setMyAnswerForChallenge } from "../../../redux/answerSlice";
import { apiPostAnswer, apiUploadPicture } from "../../../tools/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dataURItoFile } from "../../../tools/imageTools";
import { clearPictureToUpload } from "../../../redux/pictureSlice";

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

  const submittedAnswer = findChallengeAnswer();
  const submittedAnswerText =
    submittedAnswer != null ? submittedAnswer.answer : "";

  const [updatedAnswer, setUpdatedAnswer] = useState(
    submittedAnswerText !== "" ? submittedAnswerText : null
  );
  const [errorText, setErrorText] = useState("");
  const submissionEnabled = !!updatedAnswer;
  const hasError = !!errorText;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  if (challenge == null) {
    return <main>Loading challenge data...</main>;
  }

  if (updatedAnswer === null && submittedAnswerText !== "") {
    setUpdatedAnswer(submittedAnswerText);
  }

  // !!!
  // if (pictureToUpload !== null) {
  //   console.log("Uploadable picture is set!");
  //   console.log(pictureToUpload.substring(0, 60));
  // } else {
  //   console.log("Uploadable picture is empty");
  // }

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
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </main>
    </>
  );

  function getSelectedChallenge(challenges, id) {
    const integerId = parseInt(id);
    return challenges.find((challenge) => challenge.id === integerId);
  }

  function goBack() {
    dispatch(clearPictureToUpload());
    navigate(-1);
  }

  function submitAnswer() {
    apiPostAnswer(challengeId, userId, updatedAnswer)
      .then(onAnswerSubmitted)
      .catch(handleSubmissionError);
    if (pictureToUpload != null) {
      uploadSelectedImage();
    }
  }

  /**
   * Find answer for this particular challenge
   * @return {null|string}
   */
  function findChallengeAnswer() {
    return myAnswers === null
      ? null
      : myAnswers.find(
          (answer) => answer.challengeId === parseInt(challengeId)
        );
  }

  function handleSubmissionError(error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      setErrorText("Something wrong with submission, contact the organizers!");
    }
  }

  function onAnswerSubmitted() {
    setErrorText("");
    toast.success("Answer saved");
    dispatch(
      setMyAnswerForChallenge({
        challengeId: challengeId,
        answer: updatedAnswer,
      })
    );
  }

  function uploadSelectedImage() {
    const imageFile = dataURItoFile(pictureToUpload, "image.jpeg");
    toast.info("Uploading photo...", {
      toastId: "image-upload-toast",
      autoClose: false,
    });
    apiUploadPicture(challengeId, userId, imageFile)
      .then(() => {
        toast.update("image-upload-toast", {
          type: "success",
          render: "Photo uploaded",
          autoClose: true,
        });
        dispatch(clearPictureToUpload());
      })
      .catch((error) =>
        toast.update("image-upload-toast", {
          type: "error",
          render: "Photo upload failed",
          autoClose: true,
        })
      );
  }
}
