import { fileURLToPath } from "node:url";
import path from "path";
import fs from "fs";

// Determine the directory name
const nameOfThisFile = fileURLToPath(import.meta.url);
const directoryOfThisFile = path.dirname(nameOfThisFile);

// Extract version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(directoryOfThisFile, "../package.json"), "utf8")
);

/** The current version of the application. */
export const version = packageJson.version;
