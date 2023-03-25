package no.strazdins.rebus.services;

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

  public Iterable<Challenge> getAll() {
    return challengeRepository.findAll();
  }
}
