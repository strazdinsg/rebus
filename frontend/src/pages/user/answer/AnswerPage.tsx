import "./AnswerPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { ImageUploader } from "./ImageUploader";
import { UserContext } from "../../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChallenges } from "../../../queries/challengeQueries";
import {
  useMyAnswers,
  useUpdateMyAnswer,
} from "../../../queries/answerQueries";
import { useImage, useUploadImage } from "../../../queries/imageQueries";
import { AnswerDto, ChallengeDto } from "../../../api-v1/models";
import { ImagePreview } from "./ImagePreview";

/**
 * A page where the team can submit an answer for one specific challenge.
 */
export function AnswerPage() {
  const { challengeId } = useParams();
  const challengeIdNum = challengeId ? parseInt(challengeId) : 0;
  const challenges = useChallenges();
  const updateMyAnswer = useUpdateMyAnswer(onAnswerSaved, onAnswerSaveFailed);
  const myAnswers = useMyAnswers();
  const submittedAnswer = findChallengeAnswer();
  const imageUrl = submittedAnswer?.imageUrl || null;
  const existingImage = useImage(imageUrl);

  const user = useContext(UserContext).user;
  const userId = user !== null ? user.id : -1;

  // Image stuff
  const [updatedImageData, setUpdatedImageData] = useState<string | null>(null);
  const uploadImage = useUploadImage(
    challengeIdNum,
    userId,
    onImageUploaded,
    onImageUploadFailed
  );
  const [imagePreview, setImagePreview] = useState<string>("");
  const existingImageData = existingImage?.data || null;
  useEffect(() => {
    if (existingImageData) {
      setImagePreview(URL.createObjectURL(existingImageData));
    }
  }, [existingImageData]);

  const challenge = challenges.data
    ? getSelectedChallenge(challenges.data.data, challengeIdNum)
    : null;

  let submittedAnswerText =
    submittedAnswer != null ? submittedAnswer.answer : "";
  if (!submittedAnswerText) {
    submittedAnswerText = "";
  }

  const [updatedAnswer, setUpdatedAnswer] = useState(
    submittedAnswerText !== "" ? submittedAnswerText : null
  );
  const [errorText, setErrorText] = useState("");
  const submissionEnabled = !updateMyAnswer.isPending && updatedAnswer != "";
  const hasError = !!errorText;
  const navigate = useNavigate();

  if (
    challenges.isPending ||
    myAnswers.isPending ||
    (imageUrl && existingImage && existingImage.isPending)
  ) {
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
          <ImageUploader onImagePicked={setUpdatedImageData} />
          <ImagePreview imageSource={imagePreview} />

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
    if (myAnswers.data && challengeIdNum > 0) {
      const myAnswerList = myAnswers.data.data?.answers || [];
      answer =
        myAnswerList.find((a) => a.challengeId === challengeIdNum) || null;
    }
    return answer;
  }

  function onAnswerSaveFailed() {
    toast.error("Could not save answer, contact the organizers!");
  }

  function onAnswerSaved() {
    setErrorText("");
    // Delay the toast to avoid flickering
    setTimeout(() => {
      toast.success("Answer saved", {
        toastId: "answer-save-toast",
      });
    }, 10);
  }

  function uploadSelectedImage() {
    if (!updatedImageData) {
      return;
    }

    uploadImage.mutate(updatedImageData);

    toast.info("Uploading photo...", {
      toastId: "image-upload-toast",
      autoClose: false,
    });
  }

  function onImageUploaded() {
    toast.update("image-upload-toast", {
      type: "success",
      render: "Photo uploaded",
      autoClose: 3000,
    });
    setUpdatedImageData(null);
  }

  function onImageUploadFailed() {
    toast.update("image-upload-toast", {
      type: "error",
      render: "Photo upload failed",
      autoClose: 3000,
    });
  }
}
