package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.strazdins.rebus.dto.MyAnswerDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  @GetMapping("/answers/my")
  public ResponseEntity<?> getMyAnswers() {
    Integer userId = userService.getAuthenticatedUserId();
    if (userId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Must log in");
    }

    return ResponseEntity.ok(answerService.getForTeam(userId));
  }

  /**
   * Upload an answer to a challenge.
   *
   * @param challengeId ID of the challenge
   * @param userId      ID of the team (user)
   * @param answer      The provided answer
   * @return HTTP OK, with "success" in the body (so that JSON parsing works)
   */
  @PostMapping("/answers/{challengeId}/{userId}")
  public ResponseEntity<String> postAnswer(@PathVariable Integer challengeId,
                                           @PathVariable Integer userId,
                                           @RequestBody MyAnswerDto answer) {
    if (userService.isForbiddenToAccessUser(userId)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Can't post an answer in the name of another team");
    }

    answerService.updateAnswerText(challengeId, userId, answer.answer());
    return ResponseEntity.ok("\"success\"");
  }
}
