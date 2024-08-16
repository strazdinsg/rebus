import React from "react";

/**
 * A component for displaying an image preview.
 *
 * @param props The props for the component
 * @param props.imageSource The source of the image to display
 * @constructor
 */
export function ImagePreview(props: { imageSource: string }) {
  return (
    <img
      id="image-preview"
      src={props.imageSource}
      style={{ display: props.imageSource ? "block" : "none" }}
      alt="Preview of the user-selected file"
    />
  );
}
