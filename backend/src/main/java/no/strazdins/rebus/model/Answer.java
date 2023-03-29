package no.strazdins.rebus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

/**
 * An answer from a specific user to a specific challenge.
 * Contains an ID of an associated image as well.
 */
@Entity
@Data
public class Answer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;
  private String answer;
  @ManyToOne
  private User user;
  @ManyToOne
  private Challenge challenge;
  private Integer score;
}
