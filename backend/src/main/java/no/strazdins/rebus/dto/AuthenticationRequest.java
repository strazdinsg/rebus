package no.strazdins.rebus.dto;

/**
 * Data that the user will send in the login request.
 */
public record AuthenticationRequest(String pin) {
}
