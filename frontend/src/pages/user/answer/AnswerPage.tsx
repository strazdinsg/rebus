import "./AnswerPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ImageUploader } from "./ImageUploader";
import { UserContext } from "../../../context/UserContext";
import { apiUploadPicture } from "../../../tools/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dataURItoFile } from "../../../tools/imageTools";
import { ChallengeDto } from "schemas/src/challenge";
import { AnswerDto } from "schemas/src/answer";
import { useChallenges } from "../../../queries/challengeQueries";
import {
  useMyAnswers,
  useUpdateMyAnswer,
} from "../../../queries/answerQueries";

/**
 * A page where the team can submit an answer for one specific challenge.
 */
export function AnswerPage() {
  const { challengeId } = useParams();
  const challengeIdNum = challengeId ? parseInt(challengeId) : 0;
  const challenges = useChallenges();
  const updateMyAnswer = useUpdateMyAnswer(onAnswerSaved, onAnswerSaveFailed);
  const myAnswers = useMyAnswers();

  if (challenges.isPending || myAnswers.isPending) {
    return <main>Loading...</main>;
  }

  if (challenges.error) {
    return <main>Could not load challenges, contact the developer</main>;
  }

  if (updateMyAnswer.error) {
    return <main>Could not save answer, contact the developer</main>;
  }

  if (!challenges.data) {
    return <main>No challenges found</main>;
  }

  const challenge = getSelectedChallenge(challenges.data, challengeIdNum);
  const user = useContext(UserContext).user;
  const userId = user !== null ? user.id : null;

  const [pictureToUpload, setPictureToUpload] = useState<string | null>(null);

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
  const submissionEnabled = !updateMyAnswer.isPending;
  const hasError = !!errorText;
  const navigate = useNavigate();

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
          <ImageUploader
            challengeId={challengeIdNum}
            userId={userId}
            setPictureToUpload={setPictureToUpload}
          />
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
    // setPictureToUpload(null); // Is this necessary?
    navigate(-1);
  }

  function submitAnswer() {
    if (challengeIdNum && userId && updatedAnswer) {
      updateMyAnswer.mutate({
        challengeId: challengeIdNum,
        answer: updatedAnswer,
      });
      uploadSelectedImage();
    }
  }

  /**
   * Find answer for this particular challenge
   * @return {null|string}
   */
  function findChallengeAnswer(): AnswerDto | null {
    let answer = null;
    if (myAnswers.data && myAnswers.data.answers && challengeIdNum > 0) {
      answer =
        myAnswers.data.answers.find((a) => a.challengeId === challengeIdNum) ||
        null;
    }
    return answer;
  }

  function onAnswerSaveFailed() {
    toast.error("Could not save answer, contact the organizers!");
  }

  function onAnswerSaved() {
    setErrorText("");
    toast.success("Answer saved");
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
          setPictureToUpload(null);
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
