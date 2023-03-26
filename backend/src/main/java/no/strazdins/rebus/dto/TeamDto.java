package no.strazdins.rebus.dto;

import no.strazdins.rebus.model.User;

/**
 * Class used as a Data-Transfer-Object for Team data.
 *
 * @param id   ID of the team
 * @param name Name of the team
 */
public record TeamDto(int id, String name) {
  public TeamDto(User user) {
    this(user.getId(), user.getName());
  }
}
