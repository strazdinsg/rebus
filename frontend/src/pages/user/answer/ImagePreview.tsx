/**
 * The ID of the element to display the preview of the image.
 */
export const PREVIEW_IMG_ELEMENT_ID = "image-preview";

/**
 * A component for displaying an image preview.
 *
 * @param props The props for the component
 * @param props.imageSource The source of the image to display. If null, the image is not displayed.
 * @constructor
 */
export function ImagePreview(props: { imageSource: string | null }) {
  return (
    <img
      id={PREVIEW_IMG_ELEMENT_ID}
      src={props.imageSource || ""}
      style={{ display: props.imageSource ? "block" : "none" }}
      alt="Preview of the user-selected file"
    />
  );
}
