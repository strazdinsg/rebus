package no.strazdins.rebus.dto;

/**
 * All score for a specific team.
 *
 * @param teamId ID of the team
 * @param score  Score per challenge (question)
 */
public record TeamScoreDto(int teamId, Iterable<ChallengeScoreDto> score) {
}
