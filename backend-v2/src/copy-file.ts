import fs from "fs/promises";
import path from "path";

// Get command line arguments
const [sourcePath, destinationPath] = process.argv.slice(2);

// Check for correct number of arguments
if (!sourcePath || !destinationPath) {
  console.error("Usage: node copy-file.mjs <source> <destination>");
  process.exit(1);
}

/**
 * Copy a file from one location to another.
 * @param src The source file path.
 * @param dest The destination file path.
 */
async function copyFile(src: string, dest: string) {
  try {
    // Resolve absolute paths
    const srcPath = path.resolve(src);
    const destPath = path.resolve(dest);

    // Copy the file
    await fs.copyFile(srcPath, destPath);

    console.log(`File copied from ${srcPath} to ${destPath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error copying file:", errorMessage);
    process.exit(1);
  }
}

// Execute the copy operation
copyFile(sourcePath, destinationPath);
