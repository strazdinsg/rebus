package no.strazdins.rebus.dto;

/**
 * Data that we will send as a response to the user when the authentication is successful.
 */
public record AuthenticationResponse(String jwt) {
}
