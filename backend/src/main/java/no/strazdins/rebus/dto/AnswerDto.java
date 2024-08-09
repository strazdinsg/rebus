package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Answer for one specific challenge (one specific team).
 */
@Schema(description = "Answer for one specific challenge (one specific team)")
public record AnswerDto(
    @Schema(description = "ID of the challenge", example = "123", required = true)
    int challengeId,
    @Schema(description = "The answer text", example = "Hello World")
    String answer,
    @Schema(description = "Score given by the grader", example = "10")
    Integer score,
    @Schema(
        description = "URL of the image submitted as an answer to a challenge by a team",
        nullable = true
    )
    String imageUrl
) {
}
