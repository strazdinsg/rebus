// Entrypoint for the application
import "./server";
import { server } from "./server";
import { loadEnvironmentVariables } from "./common/utils/environment";

loadEnvironmentVariables();

const DEFAULT_PORT = 3000;
const port = process.env.SERVER_PORT || DEFAULT_PORT;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
