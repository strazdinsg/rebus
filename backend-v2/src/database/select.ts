import { RowDataPacket } from "mysql2";
import db from "./dbConfig";

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
  return new Promise((resolve, reject) => {
    db.query(query, (err, results: RowDataPacket[]) => {
      if (err) {
        return reject(
          new Error("Can't read challenges, contact the developer.")
        );
      }
      const rows: T[] = results.map(mapper);
      resolve(rows);
    });
  });
}
