package no.strazdins.rebus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
