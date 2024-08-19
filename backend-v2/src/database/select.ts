import { RowDataPacket } from "mysql2";
import { getConnection } from "./database";

/**
 * Generic function for executing a SELECT query and mapping the results to a specific type.
 *
 * @param query The SQL query to execute.
 * @param mapper A function that maps an SQL result row to a specific object type..
 */
export function select<T>(
  query: string,
  mapper: (packet: RowDataPacket) => T
): Promise<T[]> {
  return new Promise(async (resolve, reject) => {
    const db = await getConnection();
    if (!db) {
      return reject(
        new Error("Database connection error, contact the developer.")
      );
    }
    db.query(query, (err, results: RowDataPacket[]) => {
      if (err) {
        return reject(
          new Error(
            "Can't select data from the database, contact the developer."
          )
        );
      }
      const rows: T[] = results.map(mapper);
      resolve(rows);
    });
  });
}
