package no.strazdins.rebus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;

/**
 * A user - can be a regular user (a team) or an admin.
 */
@Entity
@Data
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String name;
  // Plain-text pin. This is done for a reason - to give the admins an opportunity to see the PINs
  // and tell them to the participants. The PIN is auto-generated.
  @Column(unique = true)
  private String pin;
  @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
  private boolean isAdmin;

  /**
   * Check whether the user is an admin.
   *
   * @return True when this user is an admin, false otherwise.
   */
  public boolean isAdmin() {
    return isAdmin;
  }

  /**
   * Get the granted authorities for this user.
   *
   * @return A subset of {ROLE_USER, ROLE_ADMIN}
   */
  public Set<String> getAuthorities() {
    Set<String> authorities = new HashSet<>();
    authorities.add("ROLE_USER");
    if (isAdmin) {
      authorities.add("ROLE_ADMIN");
    }
    return authorities;
  }
}
