package no.strazdins.rebus;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import no.strazdins.rebus.dto.AuthenticationRequest;
import no.strazdins.rebus.dto.AuthenticationResponse;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.repositories.UserRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

@Slf4j
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthenticationTests {
  @Autowired
  private UserRepository userRepository;
  @Autowired
  MockMvc mvc;
  @Autowired
  JwtUtil jwtUtil;

  /**
   * Used for converting Object <-> JSON string
   */
  @Autowired
  ObjectMapper objectMapper;


  @BeforeEach
  void setupUsers() {
    long existingUserCount = userRepository.count();
    if (existingUserCount > 0) {
      return;
    }
    log.info("Creating users");
    userRepository.save(new User(1, "chuck", "1234", true));
    userRepository.save(new User(2, "dave", "5678", false));
  }

  @Test
  public void tryGetAuthenticate() throws Exception {
    mvc.perform(get("/authenticate")).andExpect(status().isMethodNotAllowed());
  }

  @Test
  public void tryAuthenticateWithoutPayload() throws Exception {
    mvc.perform(post("/authenticate")).andExpect(status().isBadRequest());
  }

  @Test
  public void tryAuthenticateWithoutPin() throws Exception {
    mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"food\": \"chocolate\", \"healthy\": true}")
    ).andExpect(status().isUnauthorized());
  }

  @Test
  public void tryAuthenticateWithWrongPin() throws Exception {
    Optional<User> user = userRepository.findByName("dave");
    assertTrue(user.isPresent(), "Dave should be present");
    User u = user.get();
    String requestBodyJson = getAuthBodyForPin(u.getPin() + "667");

    mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestBodyJson)
    ).andExpect(status().isUnauthorized());
  }

  @Test
  public void authenticateAsUser() throws Exception {
    Optional<User> user = userRepository.findByName("dave");
    assertTrue(user.isPresent(), "Dave should be present");
    User u = user.get();
    String responseBody = mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content(getAuthBodyForPin(u.getPin()))
    ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    expectTokenReturnedForUser(u, responseBody);
  }

  @Test
  public void authenticateAsAdmin() throws Exception {
    Optional<User> admin = userRepository.findFirstByIsAdminTrue();
    assertTrue(admin.isPresent(), "Admin should be present");
    User u = admin.get();
    String responseBody = mvc.perform(post("/authenticate")
        .contentType(MediaType.APPLICATION_JSON)
        .content(getAuthBodyForPin(u.getPin()))
    ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    expectTokenReturnedForUser(u, responseBody);
  }

  @Test
  public void accessUserEndpointWithoutToken() {
    assertTrue(false);
  }

  @Test
  public void accessUserEndpointWithUserToken() {
    assertTrue(false);
  }

  @Test
  public void accessUserEndpointWithAdminToken() {
    assertTrue(false);
  }

  @Test
  public void accessAdminEndpointWithoutToken() {
    assertTrue(false);
  }

  @Test
  public void accessAdminEndpointWithUserToken() {
    assertTrue(false);
  }

  @Test
  public void accessAdminEndpointWithAdminToken() {
    assertTrue(false);
  }


  private String getAuthBodyForPin(String pin) throws JsonProcessingException {
    AuthenticationRequest authenticationRequest = new AuthenticationRequest(pin);
    return objectMapper.writeValueAsString(authenticationRequest);
  }

  private void expectTokenReturnedForUser(User user, String responseBody)
      throws JsonProcessingException {
    HttpResponseDto<AuthenticationResponse> response = objectMapper.readValue(responseBody,
        objectMapper.getTypeFactory().constructParametricType(
            HttpResponseDto.class, AuthenticationResponse.class
        )
    );
    assertNotNull(response);
    assertNotNull(response.data());
    String jwtToken = response.data().jwt();
    assertNotNull(jwtToken);
    assertTrue(jwtUtil.validateToken(jwtToken, user.getId()));
  }
}
