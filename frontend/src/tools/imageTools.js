// Miscellaneous functions for image handling, formatting, conversion
// Code mostly from conversations with ChatGPT

/**
 * Resize an image, keep aspect ratio.
 * @param {HTMLImageElement} image Original image
 * @param {number} maxWidth Maximum allowed width
 * @param {number} maxHeight Maximum allowed height
 * @return {string} The image in Data URI format
 */
export function resizeImage(image, maxWidth, maxHeight) {
  const canvas = document.createElement("canvas");
  let width = image.width;
  let height = image.height;
  console.log(`Original image dimensions: ${width} x ${height}`);

  if (width > maxWidth || height > maxHeight) {
    if (width > height) {
      height = Math.round((height / width) * maxWidth);
      width = maxWidth;
    } else {
      width = Math.round((width / height) * maxHeight);
      height = maxHeight;
    }
  }
  console.log(`Resizing to ${width} x ${height}`);

  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg");
}

/**
 * Convert image in Data URI format to a File format. The File can be uploaded to the server as multipart data.
 * @param {string} dataURI Image in Data URI format
 * @param {string} fileName Name of the destination file
 * @return {File} The resulting image file
 */
export function dataURItoFile(dataURI, fileName) {
  const blob = dataURItoBlob(dataURI);
  return new File([blob], fileName, { type: blob.type });
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
