package no.strazdins.rebus.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import no.strazdins.rebus.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Utility class for handling JWT tokens.
 * Code from https://youtu.be/X80nJ5T7YpE
 */
@Component
public class JwtUtil {
  @Value("${jwt_secret_key}")
  private String secretKey;
  /**
   * Key inside JWT token where roles are stored.
   */
  private static final String ROLE_KEY = "roles";

  /**
   * Generate a JWT token for an authenticated user.
   *
   * @param user Object containing user details
   * @return JWT token string
   */
  public String generateToken(User user) {
    final long timeNow = System.currentTimeMillis();
    final long millisecondsInHour = 60 * 60 * 1000L;
    final long timeAfterOneDay = timeNow + millisecondsInHour * 24;

    return Jwts.builder()
        .subject(user.getName())
        .id("" + user.getId())
        .claim(ROLE_KEY, user.getAuthorities())
        .issuedAt(new Date(timeNow))
        .expiration(new Date(timeAfterOneDay))
        .signWith(getSigningKey())
        .compact();
  }

  private SecretKey getSigningKey() {
    byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
    return new SecretKeySpec(keyBytes, 0, keyBytes.length, "HmacSHA256");
  }

  /**
   * Find username from a JWT token.
   *
   * @param token JWT token
   * @return ID of the user
   */
  public int extractUserId(String token) {
    String idString = extractClaim(token, Claims::getId);
    return idString != null ? Integer.parseInt(idString) : -1;
  }

  /**
   * Check if a token is valid for a given user.
   *
   * @param token       Token to validate
   * @param userDetails Object containing user details
   * @return True if the token matches the current user and is still valid
   */
  public boolean validateToken(String token, AccessUserDetails userDetails) {
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
    return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }
}
