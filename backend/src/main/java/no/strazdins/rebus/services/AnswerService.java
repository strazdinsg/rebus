package no.strazdins.rebus.services;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import no.strazdins.rebus.dto.AnswerDto;
import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.model.Answer;
import no.strazdins.rebus.repositories.AnswerRepository;
import no.strazdins.rebus.repositories.ChallengeRepository;
import no.strazdins.rebus.repositories.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Answer-related routines.
 */
@Service
public class AnswerService {
  private final AnswerRepository answerRepository;
  private final UserRepository userRepository;
  private final ChallengeRepository challengeRepository;

  /**
   * Create AnswerService.
   *
   * @param answerRepository    Injected by Spring
   * @param userRepository      Injected by Spring
   * @param challengeRepository Injected by Spring
   */
  public AnswerService(AnswerRepository answerRepository, UserRepository userRepository,
                       ChallengeRepository challengeRepository) {
    this.answerRepository = answerRepository;
    this.userRepository = userRepository;
    this.challengeRepository = challengeRepository;
  }

  /**
   * Get all answers submitted by a specific team.
   *
   * @param teamId ID of the team
   * @return List of all answers given by the team, formatted for transmission.
   */
  public TeamAnswerDto getForTeam(int teamId) {
    List<AnswerDto> challengeAnswers = new LinkedList<>();
    for (Answer answer : answerRepository.findByUserId(teamId)) {
      challengeAnswers.add(new AnswerDto(answer.getChallenge().getId(), answer.getAnswer()));
    }
    return new TeamAnswerDto(teamId, challengeAnswers);
  }

  /**
   * Set an answer text - create new or update an existing.
   *
   * @param challengeId ID of the challenge for which the answer is submitted
   * @param userId      ID of the team (user)
   * @param answerText  The answer text
   */
  public void updateAnswerText(int challengeId, int userId, String answerText) {
    Optional<Answer> answer = answerRepository.findByUserIdAndChallengeId(userId, challengeId);
    Answer newAnswer;
    if (answer.isPresent()) {
      newAnswer = answer.get();
    } else {
      newAnswer = new Answer();
      newAnswer.setUser(userRepository.findById(userId).orElse(null));
      newAnswer.setChallenge(challengeRepository.findById(challengeId).orElse(null));
    }
    newAnswer.setAnswer(answerText);
    answerRepository.save(newAnswer);
  }
}
