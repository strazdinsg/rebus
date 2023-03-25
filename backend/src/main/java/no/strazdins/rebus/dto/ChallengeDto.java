package no.strazdins.rebus.dto;

import no.strazdins.rebus.model.Challenge;

/**
 * Class used as a Data-Transfer-Object for Challenge data.
 */
public record ChallengeDto(int id, String question) {
  public ChallengeDto(Challenge challenge) {
    this(challenge.getId(), challenge.getQuestion());
  }
}
