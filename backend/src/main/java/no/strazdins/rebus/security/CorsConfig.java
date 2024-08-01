package no.strazdins.rebus.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configure CORS for the application.
 */
@Configuration
public class CorsConfig {
  @Value("${allowed_origins}")
  private String allowedOriginsString;

  /**
   * Configure CORS for the application.
   *
   * @return WebMvcConfigurer bean for CORS
   */
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        String[] allowedOrigins = allowedOriginsString.split(",");

        registry.addMapping("/**")
            .allowedOrigins(allowedOrigins)  // Replace with your allowed origins
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
      }
    };
  }
}
