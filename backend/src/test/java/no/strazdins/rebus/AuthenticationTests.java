package no.strazdins.rebus;

import com.fasterxml.jackson.core.JsonProcessingException;
import no.strazdins.rebus.dto.AuthenticationRequest;
import no.strazdins.rebus.dto.AuthenticationResponse;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthenticationTests {
  @Autowired
  MockMvc mvc;

  @Autowired
  JwtUtil jwtUtil;

  @Autowired
  TestHelper testHelper;

  @BeforeEach
  void setupUsers() {
    testHelper.createDefaultUsers();
  }

  @Test
  void tryGetAuthenticate() throws Exception {
    mvc.perform(get("/authenticate")).andExpect(status().isMethodNotAllowed());
  }

  @Test
  void tryAuthenticateWithoutPayload() throws Exception {
    mvc.perform(post("/authenticate")).andExpect(status().isBadRequest());
  }

  @Test
  void tryAuthenticateWithoutPin() throws Exception {
    mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"food\": \"chocolate\", \"healthy\": true}")
    ).andExpect(status().isUnauthorized());
  }

  @Test
  void tryAuthenticateWithWrongPin() throws Exception {
    String requestBodyJson = getAuthBodyForPin(testHelper.getRegularUser().getPin() + "667");

    mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestBodyJson)
    ).andExpect(status().isUnauthorized());
  }

  @Test
  void authenticateAsUser() throws Exception {
    User u = testHelper.getRegularUser();
    String responseBody = mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content(getAuthBodyForPin(u.getPin()))
    ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    expectTokenReturnedForUser(u, responseBody);
  }

  @Test
  void authenticateAsAdmin() throws Exception {
    User u = testHelper.getAdminUser();
    String responseBody = mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content(getAuthBodyForPin(u.getPin()))
    ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    expectTokenReturnedForUser(u, responseBody);
  }

  @Test
  void accessPublicEndpointWithoutToken() throws Exception {
    mvc.perform(get("/challenges")).andExpect(status().isOk());
  }

  @Test
  void accessUserEndpointWithoutToken() throws Exception {
    mvc.perform(get("/answers/my"))
        .andExpect(status().isForbidden());
  }

  @Test
  void accessUserEndpointWithUserToken() throws Exception {
    testHelper.performUserGetRequest(mvc, "/answers/my").andExpect(status().isOk());
  }

  @Test
  void accessUserEndpointWithAdminToken() throws Exception {
    testHelper.performAdminGetRequest(mvc, "/answers/my").andExpect(status().isOk());
  }

  @Test
  void accessAdminEndpointWithoutToken() throws Exception {
    mvc.perform(get("/teams")).andExpect(status().isForbidden());
  }

  @Test
  void accessAdminEndpointWithUserToken() throws Exception {
    testHelper.performUserGetRequest(mvc, "/teams").andExpect(status().isForbidden());
  }

  @Test
  void accessAdminEndpointWithAdminToken() throws Exception {
    testHelper.performAdminGetRequest(mvc, "/teams").andExpect(status().isOk());
  }


  private void expectTokenReturnedForUser(User user, String responseBody)
      throws JsonProcessingException {
    AuthenticationResponse response = testHelper.parseResponse(responseBody, AuthenticationResponse.class);
    String jwtToken = response.jwt();
    assertNotNull(jwtToken);
    assertTrue(jwtUtil.validateToken(jwtToken, user.getId()));
  }

  private String getAuthBodyForPin(String pin) throws JsonProcessingException {
    AuthenticationRequest authenticationRequest = new AuthenticationRequest(pin);
    return testHelper.toJson(authenticationRequest);
  }
}
