package no.strazdins.rebus.repositories;

import no.strazdins.rebus.model.Challenge;
import org.springframework.data.repository.CrudRepository;

/**
 * SQL Repository for Challenge objects.
 */
public interface ChallengeRepository extends CrudRepository<Challenge, Integer> {
}
