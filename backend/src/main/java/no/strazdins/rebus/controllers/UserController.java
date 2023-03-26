package no.strazdins.rebus.controllers;

import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.services.AnswerService;
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

  public UserController(AnswerService answerService) {
    this.answerService = answerService;
  }

  @GetMapping("/answers/my")
  public TeamAnswerDto getMyAnswers() {
    return answerService.getForTeam(1); // TODO - find out the right ID from the authenticated user
  }
}
