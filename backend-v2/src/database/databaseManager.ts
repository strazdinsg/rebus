import { isTestEnvironment } from "../common/utils/environment";
import { Sequelize } from "sequelize";
import { inMemorySqliteDbSequelize } from "./inMemSqliteConnection";
import { mySqlDbSequelize } from "./mySqlConnection";

/**
 * Get a connection to the database, based on the current environment.
 * @returns A promise that resolves with a connection object.
 */
export function getConnection(): Sequelize {
  return isTestEnvironment() ? inMemorySqliteDbSequelize : mySqlDbSequelize;
}
