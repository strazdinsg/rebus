/**
 * A generic row returned by a database query.
 * The keys are the column names, and the values are the column values.
 */
export type ResultRow = {
  [key: string]: string;
};

/**
 * Converts a string to a number, or null if the string is null.
 *
 * @param value The string to convert.
 * @returns The number, or null if the string is null.
 */
export function toNullableNumber(value: string | null): number | null {
  if (value === null) {
    return null;
  }
  return parseInt(value);
}
