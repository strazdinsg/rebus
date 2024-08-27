package no.strazdins.rebus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.services.AzureBlobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

@Slf4j
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ImageControllerTests {
  private static final String IMAGE_URL = "https://example.com/pictures/123.jpg";
  private static final String TEST_IMAGE_PATH = "src/test/resources/cat.jpg";

  @MockBean
  private AzureBlobService azureBlobService;

  @Autowired
  MockMvc mvc;
  @Autowired
  private TestHelper testHelper;

  @BeforeEach
  void setUp() {
    testHelper.createDefaultUsers();
    when(azureBlobService.uploadImage(any())).thenReturn(IMAGE_URL);
  }

  @Test
  void imagePostWithoutFileFails() throws Exception {
    testHelper.performMultipartRequestForUser(mvc, "/pictures/1/1", null)
        .andExpect(status().is4xxClientError());
  }


  @Test
  void imagePostWithoutTokenFails() throws Exception {
    testHelper.performMultipartRequestWithoutToken(mvc, "/pictures/1/1", null)
        .andExpect(status().isForbidden());
  }

  @Test
  void imagePostWithTokenForAnotherTeamFails() throws Exception {
    User user = testHelper.getAnotherUser();
    int wrongTeamId = user.getId();
    String path = "/pictures/1/" + wrongTeamId;
    testHelper.performMultipartRequestForUser(mvc, path, getImageFile())
        .andExpect(status().is4xxClientError());
  }

  @Test
  void imagePostWithTokenForOwnTeamSucceeds() throws Exception {
    User user = testHelper.getRegularUser();
    int ownTeamId = user.getId();
    String path = "/pictures/1/" + ownTeamId;
    ResultActions response = testHelper.performMultipartRequestForUser(mvc, path, getImageFile());
    response.andExpect(status().isOk());
    expectImageUrlInResponse(response);
  }

  private MockMultipartFile getImageFile() throws IOException {
    FileInputStream fis = new FileInputStream(TEST_IMAGE_PATH);
    return new MockMultipartFile(
        "fileContent", // This should match the @RequestParam name in your controller
        "image.jpg",
        MediaType.IMAGE_JPEG_VALUE,
        fis
    );
  }

  private void expectImageUrlInResponse(ResultActions response)
      throws UnsupportedEncodingException, JsonProcessingException {
    String responseBody = response.andReturn().getResponse().getContentAsString();
    String imageUrl = testHelper.parseResponse(responseBody, String.class);
    assertEquals(IMAGE_URL, imageUrl);
  }
}
