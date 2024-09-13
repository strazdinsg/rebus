package no.strazdins.rebus.services;

import java.util.Optional;
import no.strazdins.rebus.model.Challenge;
import no.strazdins.rebus.repositories.ChallengeRepository;
import org.springframework.stereotype.Service;

/**
 * Provides challenge-related services.
 */
@Service
public class ChallengeService {
  private final ChallengeRepository challengeRepository;

  public ChallengeService(ChallengeRepository challengeRepository) {
    this.challengeRepository = challengeRepository;
  }

  /**
   * Get all challenges.
   *
   * @return All challenges
   */
  public Iterable<Challenge> getAll() {
    return challengeRepository.findAll();
  }

  /**
   * Get a challenge by its ID.
   *
   * @param id The ID of the challenge
   * @return The challenge with the given ID, or empty if it doesn't exist
   */
  public Optional<Challenge> findById(int id) {
    return challengeRepository.findById(id);
  }
}
