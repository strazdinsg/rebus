package no.strazdins.rebus.controllers;

import java.util.stream.StreamSupport;
import no.strazdins.rebus.dto.ChallengeDto;
import no.strazdins.rebus.model.Challenge;
import no.strazdins.rebus.services.ChallengeService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for /challenges.
 */
@CrossOrigin
@RestController
@RequestMapping("/challenges")
public class ChallengeController {
  private final ChallengeService challengeService;

  public ChallengeController(ChallengeService challengeService) {
    this.challengeService = challengeService;
  }

  @GetMapping
  public Iterable<ChallengeDto> getAll() {
    Iterable<Challenge> challenges = challengeService.getAll();
    return StreamSupport.stream(challenges.spliterator(), false).map(ChallengeDto::new).toList();
  }
}
