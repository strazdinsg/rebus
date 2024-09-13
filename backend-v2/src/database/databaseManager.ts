import { isTestEnvironment } from "../common/utils/environment";
import { Sequelize } from "sequelize";
import { inMemorySqliteDbSequelize } from "./inMemSqliteConnection";
import { mySqlDbSequelize } from "./mySqlConnection";

const useTestDatabase = isTestEnvironment();
if (useTestDatabase) {
  console.log("Using test database");
}

/**
 * Get a connection to the database, based on the current environment.
 * @returns A promise that resolves with a connection object.
 */
export function getConnection(): Sequelize {
  return useTestDatabase ? inMemorySqliteDbSequelize : mySqlDbSequelize;
}

/**
 * Create the database tables, if not already created.
 */
export async function createTables() {
  console.log("Creating tables...");
  await getConnection().sync();
}
