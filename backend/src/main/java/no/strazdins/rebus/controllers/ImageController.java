package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.AzureBlobService;
import no.strazdins.rebus.services.ImageService;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
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
@Tag(name = "User endpoints")
public class ImageController {
  private final UserService userService;
  private final AnswerService answerService;
  private final AzureBlobService azureBlobService;

  /**
   * Create a new ImageController.
   *
   * @param userService       UserService object, injected by Spring
   * @param answerService     AnswerService object, injected by Spring
   * @param azureBlobService  AzureBlobService object, injected by Spring
   */
  public ImageController(UserService userService,
                         AnswerService answerService, AzureBlobService azureBlobService) {
    this.userService = userService;
    this.azureBlobService = azureBlobService;
    this.answerService = answerService;
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
          responseCode = "200", description = "OK, Image URL in the body",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"SUCCESS\",\"message\":\"\", "
                      + "\"data\":\"https://example.com/pictures/123/456\"}"
              )
          )
      ),
      @ApiResponse(
          responseCode = "403",
          description = "Forbidden, not allowed to upload images for other teams",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":"
                      + "\"Not allowed to upload images for other teams\", \"data\":\"\"}"
              )
          )
      ),
      @ApiResponse(
          responseCode = "400",
          description = "Bad request, something went wrong with storing the image",
          // Content has no data, status: ERROR and error message
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":"
                      + "\"Could not store image\", \"data\":\"\"}"
              )
          )
      )
  })
  @PostMapping("/pictures/{challengeId}/{userId}")
  public ResponseEntity<HttpResponseDto<String>> uploadPicture(
      @RequestParam("fileContent") MultipartFile multipartFile,
      @PathVariable int challengeId,
      @PathVariable Integer userId
  ) {
    if (userService.isForbiddenToAccessUser(userId)) {
      throw new AccessDeniedException("Not allowed to upload images for other teams");
    }

    if (!ImageService.isImage(multipartFile)) {
      throw new IllegalArgumentException("Provided data is not an image");
    }

    String imageUrl = azureBlobService.uploadImage(multipartFile);
    answerService.updateImageUrl(challengeId, userId, imageUrl);
    return HttpResponseDto.okResponse(imageUrl);
  }

}
