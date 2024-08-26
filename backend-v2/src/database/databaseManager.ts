import { isTestEnvironment } from "../common/utils/environment";
import { mySqlConnection } from "./mySqlConnection";
import { DbConnection } from "./dbConnection";
import { inMemorySqliteConnection } from "./inMemSqliteConnection";

function getTestConnection(): DbConnection {
  return inMemorySqliteConnection;
}

function getProductionConnection(): DbConnection {
  return mySqlConnection;
}

/**
 * Get a connection to the database, based on the current environment.
 * @returns A promise that resolves with a connection object.
 */
export function getConnection(): DbConnection {
  return isTestEnvironment() ? getTestConnection() : getProductionConnection();
}
