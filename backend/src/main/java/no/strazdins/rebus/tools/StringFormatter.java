package no.strazdins.rebus.tools;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class StringFormatter {
  private static final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * Parse a JSON string to a Java String object.
   * @param s The JSON string
   * @return The parsed string, or null if the string is not valid JSON string
   */
  public static String parseJsonString(String s) {
    try {
      return objectMapper.readValue(s, String.class);
    } catch (JsonProcessingException e) {
      return null;
    }
  }

  /**
   * Strip quotation marks (single and/or double) from the beginning and end of the string,
   * if they exist.
   *
   * @param s The string to strip
   * @return The string without quotation marks
   */
  public static String stripQuotation(String s) {
    if (enclosedInQuotes(s) || enclosedInDoubleQuotes(s)) {
      s = stripFirstAndLastCharacter(s);
    }
    return s;
  }

  private static boolean enclosedInQuotes(String s) {
    return s != null && s.length() >= 2
        && s.startsWith("'") && s.endsWith("'");
  }

  private static boolean enclosedInDoubleQuotes(String s) {
    return s != null && s.length() >= 2
        && s.startsWith("\"") && s.endsWith("\"");
  }

  private static String stripFirstAndLastCharacter(String s) {
    return s.substring(1, s.length() - 1);
  }
}
