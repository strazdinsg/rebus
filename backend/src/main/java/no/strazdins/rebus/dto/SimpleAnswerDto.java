package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A simple answer DTO.
 * @param answer the answer
 */
@Schema(description = "An answer by a specific team to a specific challenge")
public record SimpleAnswerDto(String answer) {
}
