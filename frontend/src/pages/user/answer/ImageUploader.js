import { Button } from "@mui/material";
import { useEffect } from "react";
import { apiGetImage } from "../../../tools/api";
import { useDispatch } from "react-redux";
import {
  clearPictureToUpload,
  setPictureToUpload,
} from "../../../redux/pictureSlice";
import { resizeImage } from "../../../tools/imageTools";

const MAX_IMAGE_WIDTH = 1800;
const MAX_IMAGE_HEIGHT = 1800;

/**
 * A component for uploading images, with a preview of the image.
 * @param challengeId ID of the challenge for which the image is selected
 * @param userId The ID of the currently logged-in user
 * @return {JSX.Element}
 * @constructor
 */
export function ImageUploader({ challengeId, userId }) {
  const dispatch = useDispatch();

  // When the component is initialized - fetch the user-uploaded image for the given challenge
  useEffect(
    function () {
      async function fetchUploadedImage() {
        const imageElement = document.getElementById("image-preview");
        const imageBlob = await apiGetImage(challengeId, userId);
        if (imageBlob) {
          imageElement.src = URL.createObjectURL(imageBlob);
          imageElement.style.display = "block";
        } else {
          imageElement.style.display = "none";
        }
      }
      fetchUploadedImage().catch((_) =>
        console.log(`Image ${challengeId}/${userId} not found`)
      );
    },
    [challengeId, userId]
  );
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
          Add image
        </Button>
      </label>
      <img id="image-preview" alt="Preview of the user-selected file" />
    </>
  );

  /**
   * This function is called when the user has selected a new image to be uploaded (before it is uploaded).
   * @param event The image picking event, the selected file(s) is in event.target.files
   */
  function onImagePicked(event) {
    const imageElement = document.getElementById("image-preview");
    if (event.target.files.length > 0) {
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
          dispatch(setPictureToUpload(resizedDataUriImage));
        };
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      dispatch(clearPictureToUpload());
      imageElement.style.display = "none";
    }
  }
}
