package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * A short and simplified version of team answer data-transfer object.
 * Contains an array of answers to all challenges. Assumes that all challenges are indexed
 * from 1 to n. Places answer of challenge k in the k-minus-first element
 * in the array.
 */
@Data
@Schema(description = "Team answers, in a short form")
public class ShortTeamAnswerDto {
  @Schema(description = "ID of the team", example = "1", required = true)
  private int teamId;
  @Schema(description = "List of answers to all challenges for the team", required = true)
  private String[] answers;
  @Schema(description = "Scores for each answer", required = true)
  private Integer[] scores;

  /**
   * Create a shor version of team answers.
   *
   * @param longDto        Long form of team answers
   * @param challengeCount The total challenge count in the Rebus. Must be supplied so that
   *                       we know how large the answer array must be.
   */
  public ShortTeamAnswerDto(TeamAnswerDto longDto, int challengeCount) {
    this.answers = new String[challengeCount];
    this.scores = new Integer[challengeCount];
    for (AnswerDto answer : longDto.answers()) {
      int answerIndex = answer.challengeId() - 1;
      this.answers[answerIndex] = answer.answer();
      this.scores[answerIndex] = answer.score();
    }
    this.teamId = longDto.teamId();
  }
}
