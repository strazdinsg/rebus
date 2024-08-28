package no.strazdins.rebus;

import static org.junit.jupiter.api.Assertions.assertEquals;

import no.strazdins.rebus.tools.StringFormatter;
import org.junit.jupiter.api.Test;

class StringFormatterTest {
  @Test
  void testQuotationStrip() {
    assertEquals("", StringFormatter.stripQuotation(""));
    assertEquals("", StringFormatter.stripQuotation("''"));
    assertEquals("", StringFormatter.stripQuotation("\"\""));
    assertEquals("'", StringFormatter.stripQuotation("'"));
    assertEquals("\"", StringFormatter.stripQuotation("\""));
    assertEquals("'\"", StringFormatter.stripQuotation("'\""));
    assertEquals("\"'", StringFormatter.stripQuotation("\"'"));
    assertEquals("Hello", StringFormatter.stripQuotation("'Hello'"));
    assertEquals("Hello", StringFormatter.stripQuotation("\"Hello\""));
    assertEquals("\"Hello\"", StringFormatter.stripQuotation("'\"Hello\"'"));
    assertEquals("'Hello'", StringFormatter.stripQuotation("''Hello''"));
    assertEquals("\"Hello\"", StringFormatter.stripQuotation("\"\"Hello\"\""));
    assertEquals("'Hello'", StringFormatter.stripQuotation("\"'Hello'\""));
    assertEquals("  Hello World  ", StringFormatter.stripQuotation("  Hello World  "));
  }

  @Test
  void testParseJsonString() {
    assertEquals("Hello", StringFormatter.parseJsonString("\"Hello\""));
    assertEquals(null, StringFormatter.parseJsonString("Hello"));
    assertEquals(null, StringFormatter.parseJsonString("'Hello'"));
    assertEquals("\"Hello\"", StringFormatter.parseJsonString("\"\\\"Hello\\\"\""));
  }
}
