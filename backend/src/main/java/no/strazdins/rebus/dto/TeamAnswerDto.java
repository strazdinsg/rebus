package no.strazdins.rebus.dto;

import no.strazdins.rebus.model.Answer;

/**
 * Data-transfer object for answers to all challenges for a particular team.
 */
public record TeamAnswerDto(int teamId, Iterable<AnswerDto> answers) {
}
