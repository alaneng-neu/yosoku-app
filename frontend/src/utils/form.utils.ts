/**
 * Parse a FormDataEntryValue into a string.
 *
 * @param data The FormDataEntryValue to parse
 * @returns The string value
 */
export const formDataParseString = (
  data: FormDataEntryValue | null
): string => {
  if (!data) throw new Error("Data is required");
  return data.toString();
};

/**
 * Parse a FormDataEntryValue into a boolean, where "1" is true everything else is false.
 *
 * @param data The FormDataEntryValue to parse
 * @returns The boolean value
 */
export const formDataParseBoolString = (
  data: FormDataEntryValue | null
): boolean => {
  if (!data) throw new Error("Data is required");
  return data === "1" ? true : false;
};
