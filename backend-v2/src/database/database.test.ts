// Test the database connection
import { expect, test } from "@jest/globals";
import { closeConnection, getConnection } from "./database";

test("Can connect to the database", async () => {
  const connection = await getConnection();
  expect(connection).toBeTruthy();
  await closeConnection();
});
