package no.strazdins.rebus.controllers;

import no.strazdins.rebus.dto.HttpResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Handles exceptions thrown by the controllers.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<HttpResponseDto<String>> handleBadCredentials(BadCredentialsException ex) {
    return HttpResponseDto.errorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<HttpResponseDto<String>> handleAccessDenied(AccessDeniedException ex) {
    return HttpResponseDto.errorResponse(HttpStatus.FORBIDDEN, ex.getMessage());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<HttpResponseDto<String>> handleIllegalArgument(
      IllegalArgumentException ex) {
    return HttpResponseDto.errorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
  }

  /**
   * Handles all exceptions of type ResponseStatusException thrown by the controllers.
   *
   * @param ex Exception thrown
   * @return ResponseEntity with error response
   */
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<HttpResponseDto<String>> handleResponseStatusException(
      ResponseStatusException ex) {
    return HttpResponseDto.errorResponse(
        HttpStatus.valueOf(ex.getStatusCode().value()), ex.getReason()
    );
  }
}
