package no.strazdins.rebus.dto;

import java.util.List;

/**
 * Data-transfer object for answers to all challenges for a particular team.
 */
public record TeamAnswerDto(int teamId, List<AnswerDto> answers) {
}
