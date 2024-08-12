package no.strazdins.rebus.controllers;

/**
 * Exception thrown when an internal server error occurs (such as a database error).
 * This exception is handled by the global exception handler.
 * The exception is thrown by the controllers.
 * The exception signals an error on the server side, which is not a fault of the client.
 * This will be translated to a 500 Internal Server Error HTTP response.
 */
public class InternalServerErrorException extends RuntimeException {
  public InternalServerErrorException(String message) {
    super(message);
  }
}
