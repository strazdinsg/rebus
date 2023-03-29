package no.strazdins.rebus.repositories;

import java.util.Optional;
import no.strazdins.rebus.model.Answer;
import org.springframework.data.repository.CrudRepository;

/**
 * SQL repository for storing/retrieving Answer objects.
 */
public interface AnswerRepository extends CrudRepository<Answer, Integer> {
  Iterable<Answer> findByUserId(int userId);

  Optional<Answer> findByUserIdAndChallengeId(int userId, int challengeId);
}
