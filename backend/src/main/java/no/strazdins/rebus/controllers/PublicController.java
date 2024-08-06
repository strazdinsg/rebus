package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.StreamSupport;
import no.strazdins.rebus.dto.ChallengeDto;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.model.Challenge;
import no.strazdins.rebus.services.ChallengeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller for public endpoints.
 */
@RestController
@Tag(name = "Public endpoints")
public class PublicController {
  private final ChallengeService challengeService;

  public PublicController(ChallengeService challengeService) {
    this.challengeService = challengeService;
  }

  /**
   * Get all challenges.
   *
   * @return List of all challenges
   */
  @Operation(summary = "Get all challenges")
  @GetMapping("/challenges")
  public HttpResponseDto<List<ChallengeDto>> getAllChallenges() {
    Iterable<Challenge> challenges = challengeService.getAll();
    List<ChallengeDto> challengeDtoList = StreamSupport.stream(challenges.spliterator(), false)
        .map(ChallengeDto::new).toList();
    return HttpResponseDto.withData(challengeDtoList);
  }
}
