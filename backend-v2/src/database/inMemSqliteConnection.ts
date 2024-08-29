import { Sequelize } from "sequelize";

/**
 * The Sequelize instance used for in-memory SQLite connections.
 */
export const inMemorySqliteDbSequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});
