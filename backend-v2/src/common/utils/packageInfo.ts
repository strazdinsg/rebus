import fs from "fs";
import path from "path";

/**
 * Information from the package.json file.
 */
export const packageInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../../package.json"), "utf8")
);
