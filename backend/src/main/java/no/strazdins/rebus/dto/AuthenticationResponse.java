package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data that we will send as a response to the user when the authentication is successful.
 */
@Schema(description = "Response of a successful authentication")
public record AuthenticationResponse(
    @Schema(description = "JWT token")
    String jwt
) {
}
