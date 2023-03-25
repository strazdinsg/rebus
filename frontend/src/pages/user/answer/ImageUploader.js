import { Button } from "@mui/material";

/**
 * A component for uploading images, with a preview of the image.
 * @return {JSX.Element}
 * @constructor
 */
export function ImageUploader() {
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
      reader.readAsDataURL(file);
      reader.onload = function () {
        imageElement.src = reader.result;
        imageElement.style.display = "block";
      };
    } else {
      imageElement.style.display = "none";
    }
  }
}
