// Test the database connection
import { expect, test } from "@jest/globals";
import { getConnection } from "./database";

test("Can connect to the database", async () => {
  const connection = await getConnection();
  expect(connection).toBeTruthy();
});
