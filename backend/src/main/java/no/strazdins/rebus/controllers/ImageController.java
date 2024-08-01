package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.model.Image;
import no.strazdins.rebus.services.ImageService;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Controller for image handling endpoints.
 */
@RestController
@PreAuthorize("hasRole('USER')")
@Tag(name = "User endpoints")
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
  @Operation(summary = "Upload an image to the server")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "OK, Image ID in the body",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"SUCCESS\",\"message\":\"\", \"data\":\"123\"}"
              )
          )
      ),
      @ApiResponse(
          responseCode = "403",
          description = "Forbidden, not allowed to upload images for other teams",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":\"Not allowed to upload images for other teams\", \"data\":\"\"}"
              )
          )
      ),
      @ApiResponse(
          responseCode = "400", description = "Bad request, something went wrong with storing the image",
          // Content has no data, status: ERROR and error message
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":\"Could not store image\", \"data\":\"\"}"
              )
          )
      )
  })
  @PostMapping("/pictures/{challengeId}/{userId}")
  public ResponseEntity<HttpResponseDto<Integer>> upload(
      @RequestParam("fileContent") MultipartFile multipartFile,
      @PathVariable int challengeId,
      @PathVariable Integer userId
  ) {
    if (userService.isForbiddenToAccessUser(userId)) {
      throw new AccessDeniedException("Not allowed to upload images for other teams");
    }

    int imageId = imageService.replace(multipartFile, userId, challengeId);
    return HttpResponseDto.okResponse(imageId);
  }

  /**
   * Return image content from the database.
   *
   * @param challengeId ID of the owner user (team)
   * @param userId      ID of the owner user (team)
   * @return Image content (and correct content type) or NOT FOUND
   */
  @Operation(summary = "Get image submitted as an answer to a challenge by a team")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "OK, image content in the body"
      ),
      @ApiResponse(
          responseCode = "403", description = "Forbidden, not allowed to access images of other teams"
      ),
      @ApiResponse(
          responseCode = "404", description = "Not found, image not found"
      )
  })
  @GetMapping("/pictures/{challengeId}/{userId}")
  public ResponseEntity<byte[]> get(@PathVariable Integer challengeId,
                                    @PathVariable Integer userId) {
    if (userService.isForbiddenToAccessUser(userId)) {
      throw new AccessDeniedException("Not allowed to access images of other teams");
    }

    Image image = imageService.getByUserAndChallenge(userId, challengeId);
    if (image == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found");
    }

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_TYPE, image.getContentType())
        .body(image.getData());
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
