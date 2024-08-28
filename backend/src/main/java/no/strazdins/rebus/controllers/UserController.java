package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.UserService;
import no.strazdins.rebus.tools.StringFormatter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for endpoints accessible to all users (not just admins).
 */
@RestController
@PreAuthorize("hasRole('USER')")
@Tag(name = "User endpoints")
public class UserController {
  private final AnswerService answerService;
  private final UserService userService;

  public UserController(AnswerService answerService, UserService userService) {
    this.answerService = answerService;
    this.userService = userService;
  }

  /**
   * Get answers of the currently logged-in user.
   *
   * @return The answers of the currently logged-in user, or 401 Unauthorized
   */
  @Operation(summary = "Get answers of the currently logged-in user")
  @GetMapping("/answers/my")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "OK, answers of the currently logged-in user"
      ),
      @ApiResponse(
          responseCode = "401", description = "Unauthorized, must log in",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":\"Must log in\", \"data\":\"\"}"
              )
          )
      )
  })
  public HttpResponseDto<TeamAnswerDto> getMyAnswers() {
    Integer userId = userService.getAuthenticatedUserId();
    if (userId == null) {
      throw new AccessDeniedException("Must log in");
    }

    return HttpResponseDto.withData(answerService.getForTeam(userId));
  }

  /**
   * Upload an answer to a challenge.
   *
   * @param challengeId ID of the challenge
   * @param userId      ID of the team (user)
   * @param answer      The provided answer
   * @return HTTP OK, with "success" in the body (so that JSON parsing works)
   */
  @Operation(summary = "Post an answer to a challenge")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "OK, answer posted",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"SUCCESS\",\"message\":\"Answer posted\", \"data\":\"\"}"
              )
          )
      ),
      @ApiResponse(
          responseCode = "403", description = "Forbidden",
          // Content has no data, status: ERROR and error message
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":\"Error message\", \"data\":\"\"}"
              )
          )
      )
  })
  @PostMapping("/answers/{challengeId}/{userId}")
  public ResponseEntity<HttpResponseDto<String>> postAnswer(@PathVariable Integer challengeId,
                                                            @PathVariable Integer userId,
                                                            @RequestBody String answer) {
    if (userService.isForbiddenToAccessUser(userId)) {
      return HttpResponseDto.errorResponse(HttpStatus.FORBIDDEN,
          "Can't post an answer in the name of another team");
    }


    answer = StringFormatter.parseJsonString(answer);
    answerService.updateAnswerText(challengeId, userId, answer);
    return HttpResponseDto.okResponse("");
  }
}
