package no.strazdins.rebus.dto;

import no.strazdins.rebus.model.Challenge;

/**
 * Class used as a Data-Transfer-Object for Challenge data.
 *
 * @param id       ID of the challenge
 * @param question The question of the challenge
 * @param maxScore Max score for this challenge
 */
public record ChallengeDto(int id, String question, int maxScore) {
  public ChallengeDto(Challenge challenge) {
    this(challenge.getId(), challenge.getQuestion(), challenge.getMaxScore());
  }
}
