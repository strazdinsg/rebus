package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import no.strazdins.rebus.model.Challenge;

/**
 * Class used as a Data-Transfer-Object for Challenge data.
 *
 * @param id       ID of the challenge
 * @param question The question of the challenge
 * @param maxScore Max score for this challenge
 */
@Schema(description = "Challenge data")
public record ChallengeDto(
    @Schema(
        description = "ID of the challenge",
        example = "1",
        required = true
    )
    int id,

    @Schema(
        description = "The question of the challenge",
        example = "What is the capital of France?",
        required = true
    )
    String question,

    @Schema(
        description = "Max score for this challenge",
        example = "100"
    )
    int maxScore
) {
  public ChallengeDto(Challenge challenge) {
    this(challenge.getId(), challenge.getQuestion(), challenge.getMaxScore());
  }
}
