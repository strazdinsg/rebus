package no.strazdins.rebus.dto;

/**
 * Answer for one specific challenge (one specific team).
 */
public record AnswerDto(int challengeId, String answer, Integer score) {
}
