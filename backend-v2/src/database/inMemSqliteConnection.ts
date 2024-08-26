import { DbConnection } from "./dbConnection";
import { Sequelize } from "sequelize";
import { ResultRow } from "./resultRow";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

/**
 * A connection to an in-memory SQLite database. Used for testing.
 */
const inMemorySqliteConnection: DbConnection = {
  getSingletonInstance(): DbConnection {
    console.log("Getting singleton instance of in-memory SQLite connection");
    return this;
  },
  close: closeSqliteConnection,
  query: sqliteQuery,
};

function closeSqliteConnection(): Promise<void> {
  return sequelize.close();
}

async function sqliteQuery<T>(
  query: string,
  rowMapper: (row: ResultRow) => T
): Promise<T[]> {
  const [results, metadata] = await sequelize.query(query);
  return []; // TODO - implement
}

export { inMemorySqliteConnection };
