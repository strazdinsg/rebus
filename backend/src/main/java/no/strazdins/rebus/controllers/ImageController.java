package no.strazdins.rebus.controllers;

import no.strazdins.rebus.model.Image;
import no.strazdins.rebus.services.ImageService;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controller for image handling endpoints.
 */
@RestController
@PreAuthorize("hasRole('USER')")
public class ImageController {
  private final ImageService imageService;
  private final UserService userService;

  public ImageController(ImageService imageService, UserService userService) {
    this.imageService = imageService;
    this.userService = userService;
  }

  /**
   * Upload an image to the server.
   *
   * @param multipartFile binary data of the image
   * @param challengeId   ID of the associated challenge
   * @param userId        ID of the owner user
   * @return HTTP 200 OK with image ID in the body on success, 401 Unauthorized when the user
   *     has no permission to do the operation, 400 Bad request if something goes wrong with
   *     storing the image
   */
  @PostMapping("/pictures/{challengeId}/{userId}")
  public ResponseEntity<String> upload(@RequestParam("fileContent") MultipartFile multipartFile,
                                       @PathVariable int challengeId,
                                       @PathVariable Integer userId) {
    if (userService.isForbiddenToAccessUser(userId)) {
      return new ResponseEntity<>("Not allowed to upload images for other teams",
          HttpStatus.UNAUTHORIZED);
    }

    ResponseEntity<String> response;
    int imageId = imageService.replace(multipartFile, userId, challengeId);
    if (imageId > 0) {
      response = new ResponseEntity<>("" + imageId, HttpStatus.OK);
    } else {
      response = new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    return response;
  }

  /**
   * Return image content from the database.
   *
   * @param challengeId ID of the owner user (team)
   * @param userId      ID of the owner user (team)
   * @return Image content (and correct content type) or NOT FOUND
   */
  @GetMapping("/pictures/{challengeId}/{userId}")
  public ResponseEntity<byte[]> get(@PathVariable Integer challengeId,
                                    @PathVariable Integer userId) {
    if (userService.isForbiddenToAccessUser(userId)) {
      return new ResponseEntity<>(new byte[]{}, HttpStatus.UNAUTHORIZED);
    }

    ResponseEntity<byte[]> response;
    Image image = imageService.getByUserAndChallenge(userId, challengeId);
    if (image != null) {
      response = ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_TYPE, image.getContentType())
          .body(image.getData());
    } else {
      response = new ResponseEntity<>(new byte[]{}, HttpStatus.NOT_FOUND);
    }
    return response;
  }

  /**
   * Delete image content from the database, for the currently authenticated user and
   * given challenge.
   *
   * @param challengeId ID of the challenge associated with the image
   * @param userId      ID of the owner user (team)
   * @return HTTP OK on success, NOT FOUND when image not found
   */
  @DeleteMapping("/pictures/{challengeId}/{userId}")
  public ResponseEntity<String> delete(@PathVariable Integer challengeId,
                                       @PathVariable Integer userId) {
    if (userService.isForbiddenToAccessUser(userId)) {
      return new ResponseEntity<>("Not allowed to access images of other teams",
          HttpStatus.UNAUTHORIZED);
    }

    ResponseEntity<String> response;
    if (imageService.deleteAll(userId, challengeId)) {
      response = ResponseEntity.ok("");
    } else {
      response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return response;
  }
}
