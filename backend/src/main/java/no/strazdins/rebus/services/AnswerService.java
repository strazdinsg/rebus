package no.strazdins.rebus.services;

import java.util.LinkedList;
import java.util.List;
import no.strazdins.rebus.dto.AnswerDto;
import no.strazdins.rebus.dto.TeamAnswerDto;
import no.strazdins.rebus.model.Answer;
import no.strazdins.rebus.repositories.AnswerRepository;
import org.springframework.stereotype.Service;

/**
 * Answer-related routines.
 */
@Service
public class AnswerService {
  private final AnswerRepository answerRepository;

  public AnswerService(AnswerRepository answerRepository) {
    this.answerRepository = answerRepository;
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
}
