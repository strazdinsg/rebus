package no.strazdins.rebus.controllers;

import java.util.LinkedList;
import no.strazdins.rebus.dto.ShortTeamAnswerDto;
import no.strazdins.rebus.dto.TeamDto;
import no.strazdins.rebus.dto.TeamScoreDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for admin endpoints.
 */
@RestController
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
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
  @GetMapping("/teams")
  public Iterable<TeamDto> getAllTeams() {
    return userService.getAllTeams();
  }

  /**
   * Get answers of all teams, to all challenges.
   *
   * @return A collection of answers, per team
   */
  @GetMapping("/answers")
  public Iterable<ShortTeamAnswerDto> getAllAnswers() {
    return answerService.getAll();
  }

  /**
   * Get currently registered scores, for all teams.
   *
   * @return A collection of scores, per team
   */
  @GetMapping("/score")
  public Iterable<TeamScoreDto> getScore() {
    // TODO - implement
    return new LinkedList<>();
  }
}
