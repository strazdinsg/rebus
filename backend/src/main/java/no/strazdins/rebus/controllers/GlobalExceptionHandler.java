package no.strazdins.rebus.controllers;

import no.strazdins.rebus.dto.HttpResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Handles exceptions thrown by the controllers.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<HttpResponseDto<String>> handleBadCredentialsException(BadCredentialsException ex) {
    return HttpResponseDto.errorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<HttpResponseDto<String>> handleAccessDeniedException(AccessDeniedException ex) {
    return HttpResponseDto.errorResponse(HttpStatus.FORBIDDEN, ex.getMessage());
  }
}
