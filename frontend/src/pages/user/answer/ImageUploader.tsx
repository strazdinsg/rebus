import { Button } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { resizeImage } from "../../../tools/imageTools";
import "./ImageUploader.css";

const MAX_IMAGE_WIDTH = 1800;
const MAX_IMAGE_HEIGHT = 1800;

type ImageUploaderProps = {
  challengeId: number;
  userId: number;
  setImageToUpload: (picture: string | null) => void;
  existingImage: Blob | null;
};

/**
 * A component for uploading images, with a preview of the image.
 * @constructor
 */
export function ImageUploader(props: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (props.existingImage) {
      setPreview(URL.createObjectURL(props.existingImage));
    }
  }, [props.existingImage]);

  return (
    <>
      <label htmlFor="image-upload-input">
        <input
          type="file"
          accept="image/*"
          id="image-upload-input"
          onChange={onImagePicked}
        />
        <Button variant="outlined" id="add-image-button" component="span">
          Add photo
        </Button>
      </label>
      <img
        id="image-preview"
        src={preview}
        style={{ display: preview ? "block" : "none" }}
        alt="Preview of the user-selected file"
      />
    </>
  );

  /**
   * This function is called when the user has selected a new image to be uploaded (before it is uploaded).
   * @param event The image picking event, the selected file(s) is in event.target.files
   */
  function onImagePicked(event: ChangeEvent<HTMLInputElement>) {
    const imageElement = document.getElementById(
      "image-preview"
    ) as HTMLImageElement;
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          const resizedDataUriImage = resizeImage(
            image,
            MAX_IMAGE_WIDTH,
            MAX_IMAGE_HEIGHT
          );
          imageElement.src = resizedDataUriImage;
          imageElement.style.display = "block";
          props.setImageToUpload(resizedDataUriImage);
        };
        if (readerEvent.target) {
          image.src = readerEvent.target.result as string;
        }
      };

      reader.readAsDataURL(file);
    } else {
      props.setImageToUpload(null);
      imageElement.style.display = "none";
    }
  }
}
