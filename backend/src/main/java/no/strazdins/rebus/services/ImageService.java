package no.strazdins.rebus.services;

import java.io.IOException;
import java.util.Arrays;
import no.strazdins.rebus.model.Challenge;
import no.strazdins.rebus.model.Image;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.repositories.ChallengeRepository;
import no.strazdins.rebus.repositories.ImageRepository;
import no.strazdins.rebus.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Handles business logic for images.
 */
@Service
public class ImageService {
  private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());

  private final ImageRepository imageRepository;
  private final UserRepository userRepository;
  private final ChallengeRepository challengeRepository;

  /**
   * Create ImageService.
   *
   * @param imageRepository     Injected by Spring
   * @param userRepository      Injected by Spring
   * @param challengeRepository Injected by Spring
   */
  public ImageService(ImageRepository imageRepository, UserRepository userRepository,
                      ChallengeRepository challengeRepository) {
    this.imageRepository = imageRepository;
    this.userRepository = userRepository;
    this.challengeRepository = challengeRepository;
  }

  /**
   * Save the provided image to the storage. If an image exists already for given user and
   * challenge, delete it.
   *
   * @param imageData   The image file data, as received from the web client
   * @param userId      ID of the owner user (team)
   * @param challengeId ID of the associated challenge
   * @throws IllegalArgumentException If the input data is wrong
   */
  public int replace(MultipartFile imageData, int userId, int challengeId)
      throws IllegalArgumentException {
    if (!isImage(imageData)) {
      throw new IllegalArgumentException("Not an image");
    }
    User user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      throw new IllegalArgumentException("Wrong User ID");
    }
    Challenge challenge = challengeRepository.findById(challengeId).orElse(null);
    if (challenge == null) {
      throw new IllegalArgumentException("Wrong Challenge ID");
    }

    deleteAll(userId, challengeId);

    try {
      Image image = new Image();
      image.setData(imageData.getBytes());
      image.setContentType(imageData.getContentType());
      image.setUser(user);
      image.setChallenge(challenge);
      imageRepository.save(image);
      return image.getId();

    } catch (IOException e) {
      logger.error("Could not store image: {}", e.getMessage());
      throw new IllegalArgumentException("Could not store image");
    }
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
  private static boolean isImageContentType(String contentType) {
    return Arrays.asList(IMAGE_CONTENT_TYPES).contains(contentType);
  }

  /**
   * Get an image from database.
   *
   * @param userId      ID of the owner user (team)
   * @param challengeId ID of the associated challenge
   * @return Image or null if none found
   */
  public Image getByUserAndChallenge(int userId, int challengeId) {
    return imageRepository.findOneByChallengeIdAndUserId(challengeId, userId).orElse(null);
  }

  /**
   * Delete all images for the given user and challenge.
   *
   * @param userId      ID of the associated user
   * @param challengeId ID of the associated challenge
   * @return True when deleted, false on error
   */
  public boolean deleteAll(int userId, int challengeId) {
    boolean deleted = false;
    Iterable<Image> images = imageRepository.findAllByChallengeIdAndUserId(challengeId, userId);
    for (Image image : images) {
      logger.info("Deleting image {}: challengeId={}, userId ={}",
          image.getId(), challengeId, userId);
      imageRepository.delete(image);
      deleted = true;
    }
    return deleted;
  }
}
