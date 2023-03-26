package no.strazdins.rebus.dto;

/**
 * Data structure used for data transfer - score per challenge (for one team).
 *
 * @param challengeId ID of the challenge
 * @param score       Score in that challenge
 */
public record ChallengeScoreDto(int challengeId, int score) {
}
