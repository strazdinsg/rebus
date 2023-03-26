package no.strazdins.rebus.controllers;

import java.util.LinkedList;
import no.strazdins.rebus.dto.TeamDto;
import no.strazdins.rebus.dto.TeamScoreDto;
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

  /**
   * Create a new AdminController.
   *
   * @param userService UserService object, injected by Spring
   */
  public AdminController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/teams")
  public Iterable<TeamDto> getAllTeams() {
    return userService.getAllTeams();
  }

  @GetMapping("/score")
  public Iterable<TeamScoreDto> getScore() {
    // TODO - implement
    return new LinkedList<>();
  }
}
