package no.strazdins.rebus.controllers;

import no.strazdins.rebus.dto.AuthenticationRequest;
import no.strazdins.rebus.dto.AuthenticationResponse;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.security.AccessUserDetails;
import no.strazdins.rebus.security.JwtUtil;
import no.strazdins.rebus.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller responsible for authentication.
 */
@CrossOrigin
@RestController
public class AuthenticationController {
  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final JwtUtil jwtUtil;

  /**
   * Initialize the controller. Called by Spring framework.
   *
   * @param authenticationManager AuthenticationManager instance
   * @param userService UserService instance
   * @param jwtUtil JwtUtil instance
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
  @PostMapping("/authenticate")
  public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {
    try {
      // We don't have username and password, we simply have a PIN, which is unique
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
          authenticationRequest.pin(),
          authenticationRequest.pin()));
    } catch (BadCredentialsException e) {
      return new ResponseEntity<>("Invalid PIN", HttpStatus.UNAUTHORIZED);
    }
    final User user = userService.findByPin(authenticationRequest.pin());
    final String jwt = jwtUtil.generateToken(user);
    return ResponseEntity.ok(new AuthenticationResponse(jwt));
  }

}
