package no.strazdins.rebus.repositories;

import java.util.Optional;
import no.strazdins.rebus.model.Image;
import org.springframework.data.repository.CrudRepository;

/**
 * Repository for storing images in an SQL database.
 */
public interface ImageRepository extends CrudRepository<Image, Integer> {
  Iterable<Image> findAllByChallengeIdAndUserId(int challengeId, int userId);

  Optional<Image> findOneByChallengeIdAndUserId(int userId, int challengeId);
}
