import { ResultRow } from "./resultRow";

/**
 * Interface for a database connection.
 */
export type DbConnection = {
  /**
   * Gets a singleton connection to the database.
   * @returns A database connection.
   * Throws an error if the connection fails.
   */
  getSingletonInstance: () => DbConnection;

  /**
   * Executes a query and returns the results as an array of objects.
   *
   * @param query The SQL query to execute.
   * @param rowMapper A function that maps one SQL result row to an object.
   * @returns A promise that resolves with an array of objects.
   * Throws an error if the query fails.
   */
  query: <T>(
    query: string,
    rowMapper: (values: ResultRow) => T
  ) => Promise<T[]>;

  /**
   * Closes the connection.
   * @returns A promise that resolves when the connection is closed.
   * Throws an error if the connection was not established or if the closing fails.
   */
  close: () => Promise<void>;
};
