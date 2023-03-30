package no.strazdins.rebus.controllers;

import java.util.LinkedList;
import no.strazdins.rebus.dto.ShortTeamAnswerDto;
import no.strazdins.rebus.dto.SingleScoreDto;
import no.strazdins.rebus.dto.TeamDto;
import no.strazdins.rebus.dto.TeamScoreDto;
import no.strazdins.rebus.services.AnswerService;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
   * Get answers of all teams, to all challenges. Includes scores.
   *
   * @return A collection of answers, per team
   */
  @GetMapping("/answers")
  public Iterable<ShortTeamAnswerDto> getAllAnswers() {
    return answerService.getAll();
  }

  /**
   * Set score for a specific team, specific challenge.
   *
   * @param challengeId ID of the challenge
   * @param userId      ID of the user (team)
   * @param score       The score, can be null (then the score will be deleted)
   * @return "success"
   */
  @PostMapping("/score/{challengeId}/{userId}")
  public ResponseEntity<String> setScore(@PathVariable Integer challengeId,
                                         @PathVariable Integer userId,
                                         @RequestBody SingleScoreDto score) {
    if (score.score() != null) {
      answerService.setScore(challengeId, userId, score.score());
    } else {
      answerService.deleteScore(challengeId, userId);
    }
    return ResponseEntity.ok("\"success\"");
  }
}
