import mysql, { Connection, RowDataPacket } from "mysql2";
import { DbConnection } from "./dbConnection";
import { loadEnvironmentVariables } from "../common/utils/environment";
import { ResultRow } from "./resultRow";

loadEnvironmentVariables();

const DEFAULT_PORT = 3306;

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : DEFAULT_PORT,
};

let realMySqlConnection: Connection | null = null;

/**
 * A database connection to a MySQL database.
 */
const mySqlConnection: DbConnection = {
  getSingletonInstance(): DbConnection {
    ensureConnection();
    return this;
  },
  close: closeMySqlConnection,
  query: mysqlQuery,
};

function ensureConnection() {
  if (realMySqlConnection !== null) {
    return;
  }
  realMySqlConnection = mysql.createConnection(connectionConfig);
}

/**
 * Executes a MySQL query and returns the results as an array of objects.
 *
 * @param query The SQL query to execute.
 * @param rowMapper A function that maps one SQL result row to an object.
 * @returns A promise that resolves with an array of objects.
 * Throws an error if the query fails.
 */
async function mysqlQuery<T>(
  query: string,
  rowMapper: (row: ResultRow) => T
): Promise<T[]> {
  ensureConnection();
  return new Promise<T[]>((resolve, reject) => {
    if (realMySqlConnection === null) {
      reject(new Error("MySQL connection is not initialized"));
      return;
    }
    realMySqlConnection.query(query, (err, results: RowDataPacket[]) => {
      if (err) {
        reject(err);
      } else {
        const rows = convertMysqlRowsToGenericRows(results);
        resolve(rows.map(rowMapper));
      }
    });
  });
}

/**
 * Converts the MySQL RowDataPackets to generic ResultRows.
 *
 * @param rowDataPackets The MySQL RowDataPackets to convert.
 * @returns An array of generic ResultRows.
 */
function convertMysqlRowsToGenericRows(rowDataPackets: RowDataPacket[]) {
  const rows: ResultRow[] = rowDataPackets.map((rowDataPacket) => {
    const row: ResultRow = {};
    for (const [key, value] of Object.entries(rowDataPacket)) {
      row[key] = value;
    }
    return row;
  });
  return rows;
}

async function closeMySqlConnection(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (realMySqlConnection === null) {
      resolve();
      return;
    }
    realMySqlConnection.end((err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export { mySqlConnection };
