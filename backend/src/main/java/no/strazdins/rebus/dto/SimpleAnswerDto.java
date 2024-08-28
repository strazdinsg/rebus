package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A team's answer for one specific challenge.
 */
@Schema(description = "A team's answer for one specific challenge")
public record SimpleAnswerDto(
    @Schema(description = "The answer text", example = "Hello World")
    String answer
) {
}
