package no.strazdins.rebus.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import no.strazdins.rebus.model.User;

/**
 * Class used as a Data-Transfer-Object for Team data.
 *
 * @param id   ID of the team
 * @param name Name of the team
 */
public record TeamDto(
    @Schema(description = "ID of the team", required = true)
    int id,
    @Schema(description = "Name of the team", required = true)
    String name
) {
  public TeamDto(User user) {
    this(user.getId(), user.getName());
  }
}
