package no.strazdins.rebus;

import lombok.extern.slf4j.Slf4j;
import no.strazdins.rebus.model.Answer;
import no.strazdins.rebus.model.Challenge;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.repositories.AnswerRepository;
import no.strazdins.rebus.repositories.ChallengeRepository;
import no.strazdins.rebus.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Profile("e2etest")
@Slf4j
public class TestDataInitializer {

  private final ChallengeRepository challengeRepository;
  private final UserRepository userRepository;
  private final AnswerRepository answerRepository;

  @Value("${admin_pin}")
  private String adminPin;

  @Value("${user_pin}")
  private String userPin;
  @Value("${user_name}")
  private String userName;
  @Value("${admin_name}")
  private String adminName;

  public TestDataInitializer(ChallengeRepository challengeRepository,
                             UserRepository userRepository,
                             AnswerRepository answerRepository) {
    this.challengeRepository = challengeRepository;
    this.userRepository = userRepository;
    this.answerRepository = answerRepository;
  }

  @EventListener(ApplicationReadyEvent.class)
  public void runOnStartup() {
    log.info("App started with test profile, creating test data");
    createDefaultChallenges();
    createDefaultUsers();
    createDefaultAnswers();
  }


  private void createDefaultChallenges() {
    if (challengeRepository.count() > 0) {
      return;
    }

    log.info("Creating challenges");
    challengeRepository.save(new Challenge("First challenge", 10));
    challengeRepository.save(new Challenge("Second challenge", 20));
    challengeRepository.save(new Challenge("Third challenge", 30));
  }

  private void createDefaultUsers() {
    if (userRepository.count() > 0) {
      return;
    }
    log.info("Creating users, adminPin: {}, userPin: {}", adminPin, userPin);
    userRepository.save(new User(1, adminName, adminPin, true));
    userRepository.save(new User(2, userName, userPin, false));
    userRepository.save(new User(3, "John", "6677", false));
  }

  private void createDefaultAnswers() {
    if (answerRepository.count() > 0) {
      return;
    }
    log.info("Creating answers");
    Iterable<Challenge> challenges = challengeRepository.findAll();
    Iterable<User> users = userRepository.findAllByIsAdminFalse();
    for (Challenge challenge : challenges) {
      if (challenge.getId() < 4) {
        for (User user : users) {
          Integer score = challenge.getId() + user.getId();
          if (score % 2 == 0) {
            score = null;
          }
          createAnswer(challenge, user, "Answer to challenge " + challenge.getId()
              + " by user " + user.getId(), score);
        }
      }
    }
  }

  private void createAnswer(Challenge challenge, User user, String answerText, Integer score) {
    Answer answer = new Answer();
    answer.setAnswer(answerText);
    answer.setChallenge(challenge);
    answer.setUser(user);
    answer.setScore(score);
    answerRepository.save(answer);
  }
}
