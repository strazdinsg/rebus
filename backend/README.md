# Rebus backend

The backend for the [Rebus system](..). A Spring Boot application.

# Requirements

To run the backend, you need the following:

- Java 21 JDK or higher
- Maven
- MySQL database
- Azure Blob Storage

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
    - AZURE_STORAGE_ACCOUNT_NAME - name of the account in Azure Blob Storage
    - AZURE_STORAGE_CONNECTION_STRING - connection string for Azure Blob Storage
    - AZURE_STORAGE_CONTAINER_NAME - name of the container in Azure Blob Storage where images will
      be stored
- Configure your Azure Blob Storage account to allow CORS requests from the backend. You can do it
  in Azure Portal > your storage account > Settings > CORS. See also
  [this](https://learn.microsoft.com/en-us/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services#enabling-cors-for-azure-storage)
  for more information.

You can start the backend by executing `mvn spring-boot:run` in the terminal.

During development can simply run `RebusApplication.main()` method from your IDE.

# API documentation

The Swagger UI for API documentation is available at `/swagger-ui/index.html`.

The OpenAPI specification is available at `/openapi-docs`.

To auto-generate the client code for the frontend, you need to store the OpenAPI specification in a
file named `openapi-docs.json` in the `doc` directory.

## OpenAPI file refresh

Currently, the refreshing of the OpenAPI file is done manually. To do this, you need to:

1. Start the backend
2. Open the OpenAPI docs at `/openapi-docs`
3. Copy the response content
4. Paste the content into `doc/openapi-docs.json`
5. Format the file:
    1. Auto-format it (Cmd+Alt+L)
    2. Sort the JSON keys - use the `JSON Sorter` plugin

# Testing

Run `mvn test` to run the tests. The following environment variables are needed for tests:
- TEST_JWT_SECRET_KEY - a JWT token signing key. It can be anything, but must be long enough: 256
  bits or more (32+ characters). You can supply this either in the `.env` file or on the command
  line.
- spring-boot.run.profiles=test - specify the test profile to use the test database

For example, you can run the tests with the following command:

```bash
mvn test -Dspring-boot.run.profiles=test -DTEST_JWT_SECRET_KEY=12345678901234567890123456789012
```

# End-to-end testing

End-to-end (E2E) testing is done using Playwright, in a [separate project](../e2e-testing). For E2E
tests to work, we need to ensure static data which is synchronized between the backends. Therefore,
some environment variables need to be set:

- ADMIN_NAME - name of the admin user
- ADMIN_PIN - pin of the admin user
- USER_NAME - name of the user
- USER_PIN - pin of the user
- TEST_JWT_SECRET_KEY - secret key used to sign JWT tokens for the test environment

These will be automatically set by PlayWright. However, if you want to run this backend in test mode
manually, you need to provide the described environment variables.

