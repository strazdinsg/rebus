package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data that the user will send in the login request.
 */
@Schema(description = "Data that the user sends in the login request")
public record AuthenticationRequest(
    @Schema(description = "The PIN code of the user (team)", required = true)
    String pin
) {
}
