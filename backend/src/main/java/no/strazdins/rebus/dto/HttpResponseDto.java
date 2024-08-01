package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * A generic response object that will be returned in all HTTP responses.
 *
 * @param status  Response status: success or error
 * @param data    The data that the server will send in the response, can be null
 * @param message A message explaining the response, in case of errors
 * @param <T>     The type of the data that the server will send in the response
 */
@Schema(description = "Response from the server")
public record HttpResponseDto<T>(
    @Schema(description = "Response status: success or error")
    ResponseStatus status,
    @Schema(description = "The data that the server will send in the response, can be null")
    T data,
    @Schema(description = "A message explaining the response, in case of errors")
    String message
) {
  /**
   * Create a static response with given data.
   *
   * @param data The data that the server will send in the response
   * @param <T>  The type of the data that the server will send in the response
   */
  public static <T> HttpResponseDto<T> withData(T data) {
    return new HttpResponseDto<>(ResponseStatus.SUCCESS, data, "");
  }

  /**
   * Create a static ResponseEntity with given data.
   *
   * @param data The data that the server will send in the response
   * @param <T>  The type of the data that the server will send in the response
   */
  public static <T> ResponseEntity<HttpResponseDto<T>> okResponse(T data) {
    return ResponseEntity.ok(new HttpResponseDto<>(ResponseStatus.SUCCESS, data, ""));
  }

  /**
   * Create a static error-ResponseEntity with given return code and error message.
   *
   * @param code    The return code
   * @param message The message explaining the error
   * @param <T>     The type of the data that the server will send in the response
   */
  public static <T> ResponseEntity<HttpResponseDto<T>> errorResponse(
      HttpStatus code, String message) {
    return ResponseEntity
        .status(code)
        .body(new HttpResponseDto<>(ResponseStatus.ERROR, null, message));
  }
}
