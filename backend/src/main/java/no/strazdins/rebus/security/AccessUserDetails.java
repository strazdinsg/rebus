package no.strazdins.rebus.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import no.strazdins.rebus.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Contains authentication information, needed by UserDetailsService.
 */
public class AccessUserDetails implements UserDetails {
  private final int id;
  private final String pin;
  private final boolean isAdmin;

  /**
   * Construct an AccessUserDetails object.
   *
   * @param user A data-model User object from which the necessary information is extracted
   */
  public AccessUserDetails(User user) {
    this.id = user.getId();
    this.pin = user.getPin();
    this.isAdmin = user.isAdmin();
  }

  public int getId() {
    return id;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Set<SimpleGrantedAuthority> authorities = new HashSet<>();
    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
    if (isAdmin) {
      authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
    return authorities;
  }

  @Override
  public String getPassword() {
    return pin;
  }

  @Override
  public String getUsername() {
    return "" + id;
  }

  /**
   * Check whether this user is an administrator.
   *
   * @return True when this user is an admin, false otherwise.
   */
  public boolean isAdmin() {
    return isAdmin;
  }
}
