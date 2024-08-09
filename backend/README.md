# Rebus backend

The backend for the [Rebus system](..). A Spring Boot application.

# Getting started

First you need to ensure the following requirements are met:

- Have a MySQL database running where the data will be stored.
- Create a file named `.env`. See `example.env` file as an example on the necessary variables
- Provide the following environment variables within the `.env` file:
    - DB_USERNAME - username for the database user
    - DB_PASSWORD - password for the database user
    - DB_HOST - database hostname
    - DB_DATABASE - database name
    - DB_PORT - TCP port number for the database
    - JWT_SECRET_KEY - secret key used to sign JWT tokens
    - ALLOWED_ORIGINS - comma-separated list of allowed origins for CORS
    - BACKEND_BASE_URL - Base URL where this backend will be reachable by the frontend, used for
      image URL generation

You can start the backend by executing `mvn spring-boot:run` in the terminal.

During development can simply run `RebusApplication.main()` method from your IDE.

# API documentation

The Swagger UI for API documentation is available at `/swagger-ui/index.html`.

The OpenAPI specification is available at `/openapi-docs`.

To auto-generate the client code for the frontend, you need to store the OpenAPI specification in a
file named `openapi-docs.json` in the `doc` directory.

## OpenAPI file refresh

Currently the refreshing of the OpenAPI file is done manually. To do this, you need to:

1. Start the backend
2. Open the OpenAPI docs at `/openapi-docs`
3. Copy the response content
4. Paste the content into `doc/openapi-docs.json`
5. Format the file:
    1. Auto-format it (Cmd+Alt+L)
    2. Sort the JSON keys - use the `JSON Sorter` plugin