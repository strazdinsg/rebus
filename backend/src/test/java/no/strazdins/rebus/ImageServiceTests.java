package no.strazdins.rebus;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import no.strazdins.rebus.services.ImageService;
import org.junit.jupiter.api.Test;

class ImageServiceTests {
  @Test
  void testIsImage() {
    assertFalse(ImageService.isImage(null));
  }

  @Test
  void testIsImageContentType() {
    assertFalse(ImageService.isImageContentType(null));
    assertTrue(ImageService.isImageContentType("image/jpg"));
  }

  @Test
  void testIsImagePdf(){
    assertFalse(ImageService.isImageContentType("application/pdf"));
  }
}
