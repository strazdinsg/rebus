package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.dto.SingleScoreDto;
import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.dto.TeamDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for admin endpoints.
 */
@RestController
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin endpoints")
public class AdminController {
  private final UserService userService;

  private final AnswerService answerService;

  /**
   * Create a new AdminController.
   *
   * @param userService   UserService object, injected by Spring
   * @param answerService AnswerService object, injected by Spring
   */
  public AdminController(UserService userService, AnswerService answerService) {
    this.userService = userService;
    this.answerService = answerService;
  }

  /**
   * Get names of all teams.
   *
   * @return List of all teams
   */
  @Operation(summary = "Get all teams")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "OK, list of all teams"
      ),
      @ApiResponse(
          responseCode = "403", description = "Forbidden, no access to team listing",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":\"Must log in as admin\","
                      + " \"data\":\"\"}"
              )
          )
      )
  })
  @GetMapping("/teams")
  public HttpResponseDto<List<TeamDto>> getAllTeams() {
    return HttpResponseDto.withData(userService.getAllTeams());
  }

  /**
   * Set score for a specific team, specific challenge.
   *
   * @param challengeId ID of the challenge
   * @param userId      ID of the user (team)
   * @param score       The score, can be null (then the score will be deleted)
   * @return "success"
   */
  @Operation(summary = "Set score for a specific team, specific challenge")
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200", description = "OK, score set"
      ),
      @ApiResponse(
          responseCode = "403", description = "Forbidden, no access",
          content = @Content(
              schema = @Schema(
                  example = "{\"status\":\"ERROR\",\"message\":\"Must log in as admin\","
                      + " \"data\":\"\"}"
              )
          )
      )
  })
  @PostMapping("/score/{challengeId}/{userId}")
  public HttpResponseDto<String> setScore(@PathVariable Integer challengeId,
                                          @PathVariable Integer userId,
                                          @RequestBody SingleScoreDto score) {
    if (score.score() != null) {
      answerService.setScore(challengeId, userId, score.score());
    } else {
      answerService.deleteScore(challengeId, userId);
    }
    return HttpResponseDto.withData("");
  }
}
