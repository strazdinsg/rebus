package no.strazdins.rebus.repositories;

import no.strazdins.rebus.model.Image;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

/**
 * Repository for storing images in an SQL database.
 */
public interface ImageRepository extends CrudRepository<Image, Integer> {
  Iterable<Image> findAllByChallengeIdAndUserId(int challengeId, int userId);
  Optional<Image> findOneByChallengeIdAndUserId(int userId, int challengeId);
}
