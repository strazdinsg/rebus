package no.strazdins.rebus.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configure authentication and authorization.
 * The @EnableMethodSecurity is needed so that each endpoint can specify which role it requires
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {
  private final JwtRequestFilter jwtRequestFilter;

  public SecurityConfiguration(JwtRequestFilter jwtRequestFilter) {
    this.jwtRequestFilter = jwtRequestFilter;
  }

  /**
   * This method will be called automatically by the framework to find out what authentication
   * to use.
   *
   * @param http HttpSecurity setting builder
   * @throws Exception On configuration error
   */
  @Bean
  public SecurityFilterChain configureAuthorizationFilterChain(HttpSecurity http) throws Exception {
    // Set up the authorization requests, starting from most restrictive at the top,
    // to least restrictive on the bottom
    http
        // Disable CSRF checks. Without this it will be hard to make automated tests.
        .csrf(AbstractHttpConfigurer::disable)
        // Authentication URL is accessible for everyone
        .authorizeHttpRequests(auth -> auth.requestMatchers("/authenticate").permitAll())
        // Challenge list is accessible for everyone
        .authorizeHttpRequests(auth -> auth.requestMatchers("/challenges").permitAll())
        // Swagger UI is accessible for everyone
        .authorizeHttpRequests(auth -> auth.requestMatchers("/swagger-ui/**").permitAll())
        .authorizeHttpRequests(auth -> auth.requestMatchers("/openapi-docs/**").permitAll())

        // Allow OPTIONS requests for CORS
        .authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS).permitAll())
        // Any other request will be authenticated with a stateless policy
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
        // Enable stateless session policy
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // Enable our JWT authentication filter
        .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    // Necessary authorization for each endpoint will be configured by each method,
    // using @PreAuthorize
    return http.build();
  }

  /**
   * This is needed since Spring Boot 2.0.
   * https://stackoverflow.com/questions/52243774/consider-defining-a-bean-of-type-org-springframework-security-authentication-au
   *
   * @return AuthenticationManager instance
   * @throws Exception When no authentication manager is found
   */
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    return config.getAuthenticationManager();
  }

  /**
   * This method is called to decide what encryption to use for password checking.
   *
   * @return The password encryptor
   */
  @Bean
  public PasswordEncoder getPasswordEncoder() {
    // This is deprecated, because it is unsafe. But this is what we need for our application -
    // plain-text PINs stored in the DB
    return NoOpPasswordEncoder.getInstance();
  }
}
