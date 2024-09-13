package no.strazdins.rebus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

/**
 * One challenge (one rebus question).
 */
@Entity
@Data
public class Challenge {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String question;
  private int maxScore;

  /**
   * Default constructor for JPA.
   */
  public Challenge() {
  }

  /**
   * Constructor for Challenge.
   *
   * @param question The question of the challenge
   * @param maxScore The maximum score of the challenge
   */
  public Challenge(String question, int maxScore) {
    this.question = question;
    this.maxScore = maxScore;
  }
}
