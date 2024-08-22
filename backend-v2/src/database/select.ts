import { executeQuery } from "./database";
import { RowDataPacket } from "mysql2";

/**
 * Generic function for executing a SELECT query and mapping the results to a specific type.
 *
 * @param query The SQL query to execute.
 * @param mapper A function that maps an SQL result row to a specific object type..
 */
export async function select<T>(
  query: string,
  mapper: (packet: RowDataPacket) => T
): Promise<T[]> {
  try {
    const rows = await executeQuery(query);
    return rows.map(mapper);
  } catch (err) {
    throw err;
  }
}
