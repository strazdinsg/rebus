package no.strazdins.rebus.repositories;

import java.util.Optional;
import no.strazdins.rebus.model.User;
import org.springframework.data.repository.CrudRepository;

/**
 * SQL repository for User objects.
 */
public interface UserRepository extends CrudRepository<User, Integer> {
  Optional<User> findOneByPin(String pin);
}
