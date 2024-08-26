import { describe, expect, it } from "vitest";
import { getConnection } from "./databaseManager";

describe("Database Manager", () => {
  it("Can connect to the database", async () => {
    const connection = getConnection();
    expect(connection).toBeTruthy();
    await connection.close();
  });
});
