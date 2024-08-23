package no.strazdins.rebus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import no.strazdins.rebus.dto.AnswerDto;
import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.model.Answer;
import no.strazdins.rebus.model.Challenge;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.repositories.AnswerRepository;
import no.strazdins.rebus.repositories.ChallengeRepository;
import no.strazdins.rebus.repositories.UserRepository;
import no.strazdins.rebus.services.AnswerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AnswerServiceTests {
  // Team 1 has answered challenge 1 with imageUrl
  // Challenge 2 was answered by:
  //   Team 1 with score 10, imageUrl
  //   Team 2 with no score, no imageUrl
  // Challenge 3 was answered by:
  //   Team 1 with no score, no imageUrl
  // Challenge 4 has no answers
  // Admin has graded challenge 1 with score 10, challenge 2 has no score
  // Team 667 has no answers

  private static final int TEAM1_ID = 1;
  private static final int TEAM2_ID = 2;
  private static final int NON_EXISTING_TEAM_ID = 667;
  private static final int TWO_ANSWER_CHALLENGE_ID = 2;
  private static final int SINGLE_ANSWER_CHALLENGE_ID = 3;
  private static final int NO_ANSWER_CHALLENGE_ID = 4;

  @MockBean
  private AnswerRepository answerRepository;

  @MockBean
  private UserRepository userRepository;

  @MockBean
  private ChallengeRepository challengeRepository;

  @Autowired
  private AnswerService answerService;

  private final List<Answer> team1Answers = new LinkedList<>();
  private final List<Answer> emptyAnswers = new LinkedList<>();

  private Answer savedAnswer;

  @BeforeEach
  void setUp() {
    Challenge twoAnswerChallenge = new Challenge();
    twoAnswerChallenge.setId(TWO_ANSWER_CHALLENGE_ID);
    twoAnswerChallenge.setQuestion("First? (answered by team 1 and team 2)");
    twoAnswerChallenge.setMaxScore(10);

    Challenge singleAnswerChallenge = new Challenge();
    singleAnswerChallenge.setId(SINGLE_ANSWER_CHALLENGE_ID);
    singleAnswerChallenge.setQuestion("Second? (answered by team 1)");
    singleAnswerChallenge.setMaxScore(10);

    Challenge noAnswerChallenge = new Challenge();
    noAnswerChallenge.setId(NO_ANSWER_CHALLENGE_ID);
    noAnswerChallenge.setQuestion("Unanswered?");
    noAnswerChallenge.setMaxScore(20);

    User user1 = new User();
    user1.setId(TEAM1_ID);
    user1.setName("Team 1");
    user1.setPin("1234");
    user1.setAdmin(false);

    User user2 = new User();
    user2.setId(TEAM2_ID);
    user2.setName("Team 2");
    user2.setPin("667123");
    user2.setAdmin(false);

    Answer answerWithScoreAndUrl = new Answer();
    answerWithScoreAndUrl.setChallenge(twoAnswerChallenge);
    answerWithScoreAndUrl.setUser(user1);
    answerWithScoreAndUrl.setScore(10);
    answerWithScoreAndUrl.setAnswer("One");
    answerWithScoreAndUrl.setImageUrl("https://example.com/image.png");

    Answer answerWithoutScore = new Answer();
    answerWithoutScore.setChallenge(singleAnswerChallenge);
    answerWithoutScore.setUser(user1);
    answerWithoutScore.setAnswer("Two");

    Answer team2Answer = new Answer();
    team2Answer.setChallenge(twoAnswerChallenge);
    team2Answer.setUser(user2);
    team2Answer.setAnswer("Two two");

    team1Answers.clear();
    team1Answers.add(answerWithScoreAndUrl);
    team1Answers.add(answerWithoutScore);

    when(answerRepository.findByUserId(TEAM1_ID)).thenReturn(team1Answers);
    when(answerRepository.findByUserId(NON_EXISTING_TEAM_ID)).thenReturn(emptyAnswers);

    when(answerRepository.findByUserIdAndChallengeId(TEAM1_ID, NO_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.empty());
    when(answerRepository.findByUserIdAndChallengeId(TEAM1_ID, TWO_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.of(answerWithScoreAndUrl));
    when(answerRepository.findByUserIdAndChallengeId(TEAM1_ID, SINGLE_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.of(answerWithoutScore));
    when(answerRepository.findByUserIdAndChallengeId(TEAM2_ID, TWO_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.of(team2Answer));

    when(userRepository.findById(TEAM1_ID)).thenReturn(Optional.of(user1));
    when(userRepository.findById(TEAM2_ID)).thenReturn(Optional.of(user2));

    when(challengeRepository.findById(TWO_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.of(twoAnswerChallenge));
    when(challengeRepository.findById(SINGLE_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.of(singleAnswerChallenge));
    when(challengeRepository.findById(NO_ANSWER_CHALLENGE_ID))
        .thenReturn(Optional.of(noAnswerChallenge));

    when(answerRepository.save(any())).then(args -> savedAnswer = args.getArgument(0));
  }

  @Test
  void testGetForTeam() {
    expectTeamAnswers(TEAM1_ID, team1Answers);
  }

  @Test
  void testGetForTeamEmpty() {
    expectTeamAnswers(NON_EXISTING_TEAM_ID, emptyAnswers);
  }

  private void expectTeamAnswers(int teamId, List<Answer> expectedAnswers) {
    TeamAnswerDto teamAnswerDto = answerService.getForTeam(teamId);
    assertNotNull(teamAnswerDto);
    assertEquals(teamId, teamAnswerDto.teamId());
    assertEquals(expectedAnswers.size(), teamAnswerDto.answers().size());
    for (int i = 0; i < expectedAnswers.size(); i++) {
      Answer a = expectedAnswers.get(i);
      AnswerDto answerDto = new AnswerDto(a.getChallenge().getId(), a.getAnswer(), null, a.getImageUrl());
      assertEquals(answerDto, teamAnswerDto.answers().get(i));
    }
  }


  @Test
  void testSetScoreForNonExistingAnswer() {
    answerService.setScore(NO_ANSWER_CHALLENGE_ID, TEAM1_ID, 7);
    assertEquals(7, savedAnswer.getScore());
    assertEquals(NO_ANSWER_CHALLENGE_ID, savedAnswer.getChallenge().getId());
    assertEquals(TEAM1_ID, savedAnswer.getUser().getId());
  }

  @Test
  void testSetScoreForExistingAnswer() {
    answerService.setScore(TWO_ANSWER_CHALLENGE_ID, TEAM1_ID, 8);
    assertEquals(8, savedAnswer.getScore());
    assertEquals(TWO_ANSWER_CHALLENGE_ID, savedAnswer.getChallenge().getId());
    assertEquals(TEAM1_ID, savedAnswer.getUser().getId());
  }

}
