package no.strazdins.rebus.services;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import no.strazdins.rebus.dto.TeamDto;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.repositories.UserRepository;
import no.strazdins.rebus.security.AccessUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Service for user-related routines.
 */
@Service
public class UserService implements UserDetailsService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public AccessUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Optional<User> user = userRepository.findOneByPin(username);
    AccessUserDetails userDetails = null;
    if (user.isPresent()) {
      userDetails = new AccessUserDetails(user.get());
    }
    return userDetails;
  }

  /**
   * Get access-user by ID.
   *
   * @param id ID of the user
   * @return The AccessUserDetails object or null if none found by that ID
   */
  public AccessUserDetails getAccessUserById(int id) {
    Optional<User> user = userRepository.findById(id);
    AccessUserDetails userDetails = null;
    if (user.isPresent()) {
      userDetails = new AccessUserDetails(user.get());
    }
    return userDetails;
  }

  /**
   * Get all users stored in the database. Excludes administrators.
   *
   * @return An iterable collection of users
   */
  public Iterable<TeamDto> getAllTeams() {
    List<TeamDto> teams = new LinkedList<>();
    Iterable<User> users = userRepository.findAll();
    for (User user : users) {
      if (!user.isAdmin()) {
        teams.add(new TeamDto(user));
      }
    }
    return teams;
  }

  /**
   * Find the user identified by the PIN code.
   *
   * @param pin PIN code of the desired user
   * @return The user, or null if none found by the PIN
   */
  public User findByPin(String pin) {
    return userRepository.findOneByPin(pin).orElse(null);
  }

  /**
   * Get the currently authenticated user, Optional.empty() if no authenticated user
   * in this session.
   */
  public Optional<AccessUserDetails> getAuthenticatedUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Optional<AccessUserDetails> userDetails;
    if (authentication != null) {
      userDetails = Optional.of((AccessUserDetails) authentication.getPrincipal());
    } else {
      userDetails = Optional.empty();
    }
    return userDetails;
  }

}
