package no.strazdins.rebus.repositories;

import java.util.Optional;
import no.strazdins.rebus.model.User;
import org.springframework.data.repository.CrudRepository;

/**
 * SQL repository for User objects.
 */
public interface UserRepository extends CrudRepository<User, Integer> {
  /**
   * Finds a user by PIN (password).
   *
   * @param pin the PIN
   * @return the user with the given PIN
   */
  Optional<User> findOneByPin(String pin);

  /**
   * Finds a user by its name.
   *
   * @param name the name of the user
   * @return the user with the given name
   */
  Optional<User> findByName(String name);

  /**
   * Finds the first admin user.
   *
   * @return The first admin user.
   */
  Optional<User> findFirstByIsAdminTrue();

  /**
   * Finds all users that are not admins.
   *
   * @return All users that are not admins.
   */
  Iterable<User> findAllByIsAdminFalse();

}
