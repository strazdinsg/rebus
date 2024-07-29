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
import { RootState } from "../../../redux/store";
import { ChallengeDto } from "schemas/src/challenge";
import { AnswerDto } from "schemas/src/answer";

/**
 * A page where the team can submit an answer for one specific challenge.
 */
export function AnswerPage() {
  const { challengeId } = useParams();
  const challengeIdNum = challengeId ? parseInt(challengeId) : null;
  const challenges = useSelector(
    (state: RootState) => state.challengeStore.challenges
  );
  const challenge = getSelectedChallenge(challenges, challengeIdNum);
  const myAnswers = useSelector(
    (state: RootState) => state.answerStore.myAnswers
  );
  const pictureToUpload = useSelector(
    (state: RootState) => state.pictureStore.pictureToUpload
  );
  const user = useContext(UserContext).user;
  const userId = user !== null ? user.id : null;

  const submittedAnswer = findChallengeAnswer();
  let submittedAnswerText =
    submittedAnswer != null ? submittedAnswer.answer : "";
  if (!submittedAnswerText) {
    submittedAnswerText = "";
  }

  const [updatedAnswer, setUpdatedAnswer] = useState(
    submittedAnswerText !== "" ? submittedAnswerText : null
  );
  const [errorText, setErrorText] = useState("");
  const submissionEnabled = !!updatedAnswer;
  const hasError = !!errorText;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  if (userId == null || challengeIdNum == null || challenge == null) {
    return <main>Loading challenge data...</main>;
  }

  if (updatedAnswer === null && submittedAnswerText !== "") {
    setUpdatedAnswer(submittedAnswerText);
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
          <ImageUploader challengeId={challengeIdNum} userId={userId} />
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

  function getSelectedChallenge(
    challenges: ChallengeDto[],
    id: number | null
  ): ChallengeDto | null {
    let challenge: ChallengeDto | null = null;
    if (id) {
      challenge = challenges.find((challenge) => challenge.id === id) || null;
    }
    return challenge;
  }

  function goBack() {
    dispatch(clearPictureToUpload(null));
    navigate(-1);
  }

  function submitAnswer() {
    if (challengeIdNum && userId && updatedAnswer) {
      apiPostAnswer(challengeIdNum, userId, updatedAnswer)
        .then(onAnswerSubmitted)
        .catch(handleSubmissionError);
      uploadSelectedImage();
    }
  }

  /**
   * Find answer for this particular challenge
   * @return {null|string}
   */
  function findChallengeAnswer(): AnswerDto | null {
    let answer = null;
    if (myAnswers && challengeId) {
      answer =
        myAnswers.find((a) => a.challengeId === parseInt(challengeId)) || null;
    }
    return answer;
  }

  function handleSubmissionError(error: any) {
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
    if (pictureToUpload == null) {
      return;
    }

    const imageFile = dataURItoFile(pictureToUpload, "image.jpeg");
    toast.info("Uploading photo...", {
      toastId: "image-upload-toast",
      autoClose: false,
    });
    if (challengeId && userId) {
      const challengeIdNum: number = parseInt(challengeId);
      apiUploadPicture(challengeIdNum, userId, imageFile)
        .then(() => {
          toast.update("image-upload-toast", {
            type: "success",
            render: "Photo uploaded",
            autoClose: 3000,
          });
          dispatch(clearPictureToUpload(null));
        })
        .catch((error) =>
          toast.update("image-upload-toast", {
            type: "error",
            render: "Photo upload failed",
            autoClose: 3000,
          })
        );
    }
  }
}
