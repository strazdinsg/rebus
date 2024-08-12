package no.strazdins.rebus.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;
import no.strazdins.rebus.services.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * A filter that is applied to all HTTP requests and checks for a valid JWT token in
 * the `Authorization: Bearer ...` header.
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
  private final UserService userService;

  private final JwtUtil jwtUtil;

  public JwtRequestFilter(UserService userService, JwtUtil jwtUtil) {
    this.userService = userService;
    this.jwtUtil = jwtUtil;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                  FilterChain filterChain)
      throws ServletException, IOException {
    final String authorizationHeader = request.getHeader("Authorization");
    Integer userId = null;
    String jwt = null;
    try {
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        jwt = authorizationHeader.substring(7);
      } else {
        // extract JWT from cookie
        Optional<Cookie> jwtCookie = Arrays.stream(request.getCookies()).filter(
            c -> c.getName().equals("jwt")).findFirst();
        if (jwtCookie.isPresent()) {
          jwt = jwtCookie.get().getValue();
        }
      }

      if (jwt != null) {
        userId = jwtUtil.extractUserId(jwt);
      }

      if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        AccessUserDetails userDetails = userService.getAccessUserById(userId);
        if (jwtUtil.validateToken(jwt, userDetails)) {
          UsernamePasswordAuthenticationToken upat = new UsernamePasswordAuthenticationToken(
              userDetails, null, userDetails.getAuthorities());
          upat.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(upat);
        }
      }
    } catch (Exception ex) {
      logger.info("Error while parsing JWT token: " + ex.getMessage());
    }
    filterChain.doFilter(request, response);
  }
}
