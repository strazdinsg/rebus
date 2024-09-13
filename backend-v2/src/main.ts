// Entrypoint for the application
import "./server";
import { server } from "./server";
import {
  getEnvN,
  isE2ETestEnvironment,
  loadEnvironmentVariables,
} from "./common/utils/environment";
import { createTables } from "./database/databaseManager";
import { insertTestData } from "./database/testData";

loadEnvironmentVariables();

const DEFAULT_PORT = 3000;
const port = getEnvN("SERVER_PORT", DEFAULT_PORT);

initialize().then(() => {
  console.log("Initialization complete");
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

async function initialize() {
  console.log("Initializing...");
  if (isE2ETestEnvironment()) {
    await createTables();
    await insertTestData();
  }
}
