/**
 * Hashes a string using the specified algorithm.
 *
 * @param input The string to hash.
 * @param algorithm The algorithm to use. Defaults to SHA-256.
 * @returns A promise that resolves with the hashed string.
 */
export async function hashString(
  input: string | null,
  algorithm: string = "SHA-256"
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input || "");

  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
