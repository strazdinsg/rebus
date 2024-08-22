import "./AnswerPage.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { ImageUploader } from "./ImageUploader";
import { UserContext } from "../../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChallenges } from "../../../queries/challengeQueries";
import {
  useMyAnswers,
  useUpdateMyAnswer,
} from "../../../queries/answerQueries";
import { useUploadImage } from "../../../queries/imageQueries";
import { AnswerDto, ChallengeDto } from "../../../api-v1/models";
import { ImagePreview, PREVIEW_IMG_ELEMENT_ID } from "./ImagePreview";
import { MainAppBar } from "../../../components/MainAppBar";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @param props The props for the component
 * @param props.challengeId The ID of the challenge to display
 * @constructor
 */
export function AnswerPage(props: { challengeId: number }) {
  const challenges = useChallenges();
  const updateMyAnswer = useUpdateMyAnswer(onAnswerSaved, onAnswerSaveFailed);
  const myAnswers = useMyAnswers();
  const submittedAnswer = findChallengeAnswer();
  const imageUrl = submittedAnswer?.imageUrl || null;

  const user = useContext(UserContext).user;
  const userId = user !== null ? user.id : -1;

  const [updatedImageData, setUpdatedImageData] = useState<string | null>(null);
  const uploadImage = useUploadImage(
    props.challengeId,
    userId,
    onImageUploaded,
    onImageUploadFailed
  );

  const challenge = challenges.data
    ? getSelectedChallenge(challenges.data.data, props.challengeId)
    : null;
  const question = challenge ? challenge.question : "";

  let submittedAnswerText =
    submittedAnswer != null ? submittedAnswer.answer : "";
  if (!submittedAnswerText) {
    submittedAnswerText = "";
  }

  const [updatedAnswer, setUpdatedAnswer] = useState(
    submittedAnswerText !== "" ? submittedAnswerText : null
  );
  const submissionEnabled = !updateMyAnswer.isPending && updatedAnswer != "";
  const navigate = useNavigate();

  let mainContent = null;

  if (challenges.isPending || myAnswers.isPending) {
    mainContent = "Loading...";
  }

  if (challenges.error) {
    mainContent = "Could not load challenges, contact the developer";
  }

  if (updateMyAnswer.error) {
    mainContent = "Could not save answer, contact the developer";
  }

  if (!challenges.data) {
    mainContent = "No challenges found";
  }

  if (userId == null || challenge == null) {
    mainContent = "Loading challenge data...";
  }

  if (updatedAnswer === null && submittedAnswerText !== "") {
    setUpdatedAnswer(submittedAnswerText);
  }

  if (!mainContent) {
    mainContent = (
      <section id="answer-container">
        <p>{question}</p>
        <TextField
          id="answer-input-field"
          label="Your answer"
          placeholder="Your answer here"
          type="text"
          multiline={true}
          onChange={(event) => setUpdatedAnswer(event.target.value)}
          value={updatedAnswer || ""}
        />
        <ImageUploader
          onImagePicked={setUpdatedImageData}
          previewElementId={PREVIEW_IMG_ELEMENT_ID}
        />
        <ImagePreview imageSource={imageUrl} />

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
      </section>
    );
  }

  return (
    <>
      <MainAppBar
        title={`Challenge ${props.challengeId}`}
        onBackClicked={goBack}
      />
      <main>{mainContent}</main>
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
    if (userId && updatedAnswer) {
      updateMyAnswer.mutate({
        challengeId: props.challengeId,
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
    if (myAnswers.data && props.challengeId > 0) {
      const myAnswerList = myAnswers.data.data?.answers || [];
      answer =
        myAnswerList.find((a) => a.challengeId === props.challengeId) || null;
    }
    return answer;
  }

  function onAnswerSaveFailed() {
    toast.error("Could not save answer, contact the organizers!");
  }

  function onAnswerSaved() {
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
