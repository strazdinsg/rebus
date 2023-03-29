package no.strazdins.rebus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

/**
 * Entity for storing image data.
 */
@Entity
@Data
public class Image {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  @Lob
  @Column(length = 20000000)
  private byte[] data;
  private String extension;
  private String contentType;
  @ManyToOne
  private User user;
  @ManyToOne
  private Challenge challenge;
}
