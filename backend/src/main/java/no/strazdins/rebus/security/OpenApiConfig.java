package no.strazdins.rebus.security;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for OpenAPI.
 * This allows to define endpoints requiring authentication.
 */
@Configuration
public class OpenApiConfig {
  @Value("${api.version}")
  private String apiVersion;

  /**
   * Create a custom OpenAPI object with security requirements. This will enable authentication
   * in the Swagger UI.
   *
   * @return OpenAPI object with security requirements
   */
  @Bean
  public OpenAPI customOpenApi() {
    return new OpenAPI()
        .info(new Info().title("Rebus backend").version(apiVersion))
        .components(new Components()
            .addSecuritySchemes("bearer-key",
                new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
            )
        )
        .addSecurityItem(new SecurityRequirement().addList("bearer-key"));
  }
}
