package no.strazdins.rebus.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.function.Function;
import no.strazdins.rebus.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Utility class for handling JWT tokens
 * Code from https://youtu.be/X80nJ5T7YpE
 */
@Component
public class JwtUtil {
  @Value("${jwt_secret_key}")
  private String secretKey;
  /**
   * Key inside JWT token where roles are stored.
   */
  private static final String JWT_AUTH_KEY = "roles";

  /**
   * Generate a JWT token for an authenticated user.
   *
   * @param user Object containing user details
   * @return JWT token string
   */
  public String generateToken(User user) {
    final long TIME_NOW = System.currentTimeMillis();
    final long MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
    final long MILLISECONDS_IN_ONE_DAY = 24 * MILLISECONDS_IN_HOUR;
    final long TIME_AFTER_30_DAYS = TIME_NOW + 30 * MILLISECONDS_IN_ONE_DAY;

    return Jwts.builder()
        .setSubject(user.getName())
        .claim(JWT_AUTH_KEY, user.getAuthorities())
        .setId("" + user.getId())
        .setIssuedAt(new Date(TIME_NOW))
        .setExpiration(new Date(TIME_AFTER_30_DAYS))
        .signWith(SignatureAlgorithm.HS256, secretKey)
        .compact();
  }

  /**
   * Find username from a JWT token.
   *
   * @param token JWT token
   * @return ID of the user
   */
  public int extractUserId(String token) {
    String idString = extractClaim(token, Claims::getSubject);
    return Integer.parseInt(idString);
  }

  /**
   * Check if a token is valid for a given user.
   *
   * @param token       Token to validate
   * @param userDetails Object containing user details
   * @return True if the token matches the current user and is still valid
   */
  public Boolean validateToken(String token, AccessUserDetails userDetails) {
    final int userId = extractUserId(token);
    return userId == userDetails.getId() && !isTokenExpired(token);
  }


  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }


}
