package no.strazdins.rebus.services;

import java.util.Arrays;
import org.springframework.web.multipart.MultipartFile;

/**
 * Handles business logic for images.
 */
public class ImageService {

  /**
   * Not allowed to instantiate this class.
   */
  private ImageService() {
  }

  /**
   * Check if the given file is an image.
   *
   * @param file File to check
   * @return True if it looks like image, false if not
   */
  public static boolean isImage(MultipartFile file) {
    return file != null && isImageContentType(file.getContentType());
  }

  /**
   * Types of content which are considered images.
   */
  private static final String[] IMAGE_CONTENT_TYPES = {
      "image/jpg", "image/png", "image/jpeg", "image/webp", "image/svg+xml"
  };

  /**
   * Checks if a given content-type of a file is an image-type.
   *
   * @param contentType The content type to check
   * @return True if it is an image-tuype, false if it is not
   */
  public static boolean isImageContentType(String contentType) {
    return Arrays.asList(IMAGE_CONTENT_TYPES).contains(contentType);
  }
}
