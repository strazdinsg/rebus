package no.strazdins.rebus.controllers;

import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for endpoints accessible to all users (not just admins).
 */
@RestController
@CrossOrigin
@PreAuthorize("hasRole('USER')")
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
}
