package no.strazdins.rebus.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.strazdins.rebus.dto.AuthenticationRequest;
import no.strazdins.rebus.dto.AuthenticationResponse;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.security.JwtUtil;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller responsible for authentication.
 */
@RestController
public class AuthenticationController {
  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final JwtUtil jwtUtil;

  /**
   * Initialize the controller. Called by Spring framework.
   *
   * @param authenticationManager AuthenticationManager instance
   * @param userService           UserService instance
   * @param jwtUtil               JwtUtil instance
   */
  public AuthenticationController(AuthenticationManager authenticationManager,
                                  UserService userService, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.userService = userService;
    this.jwtUtil = jwtUtil;
  }

  /**
   * HTTP POST request to /authenticate.
   *
   * @param authenticationRequest The request JSON object containing username and password
   * @return OK + JWT token; Or UNAUTHORIZED
   */
  @Tag(name = "Public endpoints")
  @PostMapping("/authenticate")
  @Operation(
      summary = "Log in",
      description = "Log in with a PIN code. The PIN code is unique for each team."
  )
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "OK, Authentication response in the body"),
      @ApiResponse(
          responseCode = "401",
          description = "Unauthorized, invalid PIN",
          content = @Content(
              schema = @Schema(contentSchema = String.class, description = "Error message")
          )
      )
  })
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest authenticationRequest
  ) {
    try {
      sleepToAvoidBruteForce();
      // We don't have username and password, we simply have a PIN, which is unique
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
          authenticationRequest.pin(),
          authenticationRequest.pin()));
    } catch (Exception e) {
      throw new BadCredentialsException("Invalid PIN", e);
    }
    final User user = userService.findByPin(authenticationRequest.pin());
    final String jwt = jwtUtil.generateToken(user);
    return ResponseEntity.ok(new AuthenticationResponse(jwt));
  }

  private void sleepToAvoidBruteForce() {
    try {
      Thread.sleep(500);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
    }
  }
}
