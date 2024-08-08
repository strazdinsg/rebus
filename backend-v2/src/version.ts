import path from "path";
import fs from "fs";

// Extract version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
);

/** The current version of the application. */
export const version = packageJson.version;
