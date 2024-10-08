package no.strazdins.rebus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;

/**
 * A user - can be a regular user (a team) or an admin.
 */
@Entity
@Data
@Table(name = "\"user\"")
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
   * Create a new user.
   */
  public User() {
  }

  /**
   * Create a new user.
   *
   * @param id      The ID of the user.
   * @param name    The name of the user.
   * @param pin     The PIN code of the user.
   * @param isAdmin Whether the user is an admin.
   */
  public User(int id, String name, String pin, boolean isAdmin) {
    this.id = id;
    this.name = name;
    this.pin = pin;
    this.isAdmin = isAdmin;
  }

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
