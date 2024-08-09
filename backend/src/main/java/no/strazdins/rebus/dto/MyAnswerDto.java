package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Our team's answer for one specific challenge.
 */
@Schema(description = "Our team's answer for one specific challenge")
public record MyAnswerDto(
    @Schema(description = "ID of the challenge", example = "123", required = true)
    int challengeId,
    @Schema(description = "The answer text", example = "Hello World")
    String answer
) {
}
