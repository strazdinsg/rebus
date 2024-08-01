package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Data-transfer object for answers to all challenges for a particular team.
 */
@Schema(description = "Answers to all challenges for a particular team")
public record TeamAnswerDto(
    @Schema(description = "ID of the team", example = "1")
    int teamId,
    @Schema(description = "List of answers to all challenges for the team")
    List<AnswerDto> answers
) {
}
