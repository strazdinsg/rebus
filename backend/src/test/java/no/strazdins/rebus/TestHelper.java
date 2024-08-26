package no.strazdins.rebus;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import no.strazdins.rebus.dto.AuthenticationRequest;
import no.strazdins.rebus.dto.HttpResponseDto;
import no.strazdins.rebus.model.User;
import no.strazdins.rebus.repositories.UserRepository;
import no.strazdins.rebus.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import java.util.Optional;

/**
 * A helper class for tests.
 */
@Slf4j
@Component
public class TestHelper {
  @Autowired
  JwtUtil jwtUtil;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private ObjectMapper objectMapper;


  private static final String ADMIN_USERNAME = "chuck";
  private static final String USER_USERNAME = "dave";
  private static final String ANOTHER_USER_USERNAME = "johny";

  /**
   * Add default users to the database, if they don't exist.
   */
  public void createDefaultUsers() {
    if (userRepository.count() > 0) {
      return;
    }
    log.info("Creating users");
    userRepository.save(new User(1, ADMIN_USERNAME, "1234", true));
    userRepository.save(new User(2, USER_USERNAME, "5678", false));
    userRepository.save(new User(3, ANOTHER_USER_USERNAME, "1357", false));
  }

  /**
   * Get a regular user (not admin)
   *
   * @return the user, from the database
   */
  public User getRegularUser() {
    Optional<User> user = userRepository.findByName(USER_USERNAME);
    assertTrue(user.isPresent(), "User should be present");
    return user.get();
  }

  /**
   * Get yet another regular user (not admin). Can be used in tests where another user is needed.
   *
   * @return the user, from the database
   */
  public User getAnotherUser() {
    Optional<User> user = userRepository.findByName(ANOTHER_USER_USERNAME);
    assertTrue(user.isPresent(), "User should be present");
    return user.get();
  }

  /**
   * Get an admin user
   *
   * @return the user, from the database
   */
  public User getAdminUser() {
    Optional<User> admin = userRepository.findFirstByIsAdminTrue();
    assertTrue(admin.isPresent(), "Admin should be present");
    assertTrue(admin.get().isAdmin(), "Admin should be admin");
    assertEquals(ADMIN_USERNAME, admin.get().getName());
    return admin.get();
  }

  /**
   * Create a JWT token for a user.
   *
   * @param username The username of the user
   * @return The JWT token for the user
   */
  public String getJwtForUser(String username) {
    Optional<User> user = userRepository.findByName(username);
    assertTrue(user.isPresent(), "User " + username + " should be present");
    return jwtUtil.generateToken(user.get());
  }

  /**
   * Perform a GET request with a token
   *
   * @param mvc      The MockMvc instance to use
   * @param path     The path to the endpoint
   * @param username The username of the user to use for token generation
   * @return Result of the request
   * @throws Exception If something goes wrong
   */
  private ResultActions performGetRequestWithToken(MockMvc mvc, String path, String username) throws Exception {
    String jwt = getJwtForUser(username);
    return mvc.perform(get(path).header("Authorization", "Bearer " + jwt));
  }

  /**
   * Perform a GET request with a token for a regular user
   *
   * @param mvc  The MockMvc instance to use
   * @param path The path to the endpoint
   * @return Result of the request
   * @throws Exception If something goes wrong
   */
  public ResultActions performUserGetRequest(MockMvc mvc, String path) throws Exception {
    return performGetRequestWithToken(mvc, path, USER_USERNAME);
  }

  /**
   * Perform a GET request with a token for an admin user
   *
   * @param mvc  The MockMvc instance to use
   * @param path The path to the endpoint
   * @return Result of the request
   * @throws Exception If something goes wrong
   */
  public ResultActions performAdminGetRequest(MockMvc mvc, String path) throws Exception {
    return performGetRequestWithToken(mvc, path, ADMIN_USERNAME);
  }


  /**
   * Perform a multipart request with a token for a regular user
   *
   * @param mvc  The MockMvc instance to use
   * @param path The path to the endpoint
   * @param file The file to upload
   * @return Result of the request
   * @throws Exception If something goes wrong
   */
  public ResultActions performMultipartRequestForUser(MockMvc mvc, String path,
                                                      MockMultipartFile file) throws Exception {
    return performMultipartRequest(mvc, path, USER_USERNAME, file);
  }

  public ResultActions performMultipartRequestWithoutToken(MockMvc mvc, String path,
                                                           MockMultipartFile file) throws Exception {
    return performMultipartRequest(mvc, path, null, file);
  }

  /**
   * Perform a multipart request with a token for an admin user
   *
   * @param mvc  The MockMvc instance to use
   * @param path The path to the endpoint
   * @param file The file to upload
   * @return Result of the request
   * @throws Exception If something goes wrong
   */
  public ResultActions performMultipartRequestForAdmin(MockMvc mvc, String path,
                                                       MockMultipartFile file) throws Exception {
    return performMultipartRequest(mvc, path, ADMIN_USERNAME, file);
  }

  private ResultActions performMultipartRequest(MockMvc mvc, String path, String username,
                                                MockMultipartFile file) throws Exception {
    MockMultipartHttpServletRequestBuilder request = multipart(path);
    if (file != null) {
      request.file(file);
    }
    request.contentType(MediaType.MULTIPART_FORM_DATA);
    if (username != null) {
      request.header("Authorization", "Bearer " + getJwtForUser(username));
    }

    return mvc.perform(request);
  }

  /**
   * Parses the response body from the API as a specific response class
   *
   * @param response      the response body
   * @param responseClass The expected class of response `data` field
   * @param <T>           The expected class of response `data` field
   * @return The parsed date from the response
   * @throws JsonProcessingException if the response cannot be parsed
   */
  public <T> T parseResponse(String response, Class<T> responseClass) throws JsonProcessingException {
    HttpResponseDto<T> responseDto = objectMapper.readValue(response,
        objectMapper.getTypeFactory().constructParametricType(
            HttpResponseDto.class, responseClass
        )
    );
    assertNotNull(responseDto);
    assertNotNull(responseDto.data());
    return responseDto.data();
  }

  public String toJson(Object o) throws JsonProcessingException {
    return objectMapper.writeValueAsString(o);
  }
}
