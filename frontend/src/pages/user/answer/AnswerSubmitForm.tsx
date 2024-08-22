import TextField from "@mui/material/TextField";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview, PREVIEW_IMG_ELEMENT_ID } from "./ImagePreview";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { AnswerDto } from "../../../api-v1/models";
import { useUpdateMyAnswer } from "../../../queries/answerQueries";
import { useState } from "react";
import { useUploadImage } from "../../../queries/imageQueries";

/**
 * The form for submitting an answer for a challenge.
 * Contains logic for uploading a new answer and an image.
 *
 * @param props The props for the component
 * @param props.userId The ID of the user (team)
 * @param props.challengeId The ID of the challenge
 * @param props.question The question for the challenge
 * @param props.submittedAnswer The answer that was submitted
 *
 * @constructor
 */
export function AnswerSubmitForm(props: {
  userId: number;
  challengeId: number;
  question: string;
  submittedAnswer: AnswerDto | null;
}) {
  let submittedAnswerText =
    props.submittedAnswer != null ? props.submittedAnswer.answer : "";
  if (!submittedAnswerText) {
    submittedAnswerText = "";
  }
  const imageUrl = props.submittedAnswer?.imageUrl || null;

  const [updatedAnswer, setUpdatedAnswer] = useState(
    submittedAnswerText !== "" ? submittedAnswerText : null
  );
  const [updatedImageData, setUpdatedImageData] = useState<string | null>(null);

  // Mutators
  const updateMyAnswer = useUpdateMyAnswer(onAnswerSaved, onAnswerSaveFailed);
  const uploadImage = useUploadImage(
    props.challengeId,
    props.userId,
    onImageUploaded,
    onImageUploadFailed
  );

  if (updatedAnswer === null && submittedAnswerText !== "") {
    setUpdatedAnswer(submittedAnswerText);
  }

  const submissionEnabled = !updateMyAnswer.isPending && updatedAnswer;

  if (updateMyAnswer.error) {
    return <p>"Could not save answer, contact the developer"</p>;
  }

  return (
    <section id="answer-container">
      <p>{props.question}</p>
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

  function submitAnswer() {
    if (props.userId && updatedAnswer) {
      updateMyAnswer.mutate({
        challengeId: props.challengeId,
        answer: updatedAnswer,
      });
      uploadSelectedImage();
    }
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
