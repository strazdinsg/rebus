package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO object for transferring single score property (for a single answer).
 *
 * @param score The score for the answer
 */
@Schema(description = "A single score")
public record SingleScoreDto(
    @Schema(description = "The score for the answer, can be null", example = "10", required = false)
    Integer score
) {
}
