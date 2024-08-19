import { Connection, QueryError } from "mysql2";
import mysql from "mysql2";
import { loadEnvironmentVariables } from "../common/utils/environment";

loadEnvironmentVariables();

const DEFAULT_PORT = 3306;

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : DEFAULT_PORT,
};

let connection: Connection | null = null;

/**
 * Get a connection to the MySQL database.
 *
 * @returns A connection to the database.
 */
export function getConnection(): Promise<Connection> {
  if (connection) {
    return Promise.resolve(connection);
  }

  return new Promise<Connection>((resolve, reject) => {
    connection = mysql.createConnection(config);
    connection.connect((err: QueryError | null) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        connection = null;
        reject(err);
      } else {
        console.log("Connected to MySQL");
        resolve(connection!);
      }
    });
  });
}

/**
 * Closes the MySQL database connection.
 */
export function closeConnection(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!connection) {
      resolve();
      return;
    }

    connection.end((err: QueryError | null) => {
      if (err) {
        console.error("Error closing the MySQL connection:", err);
        reject(err);
      } else {
        console.log("MySQL connection closed");
        connection = null;
        resolve();
      }
    });
  });
}
