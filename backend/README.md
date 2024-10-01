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

You can start the backend by executing `mvn spring-boot:run -Dspring-boot.run.profiles=prod` in the
terminal.

Note, that you need to specify the `prod` profile when running the application in production.
Without it some variables will not be set correctly from the `application-prod.properties` file.

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

For tests, you need to supply the following environment variables:

- TEST_JWT_SECRET_KEY - key used to sign JWT tokens for the test environment. This is not secret,
  because it is used only for testing. You can store it in a file named `.env` in the root of the
  project or supply it on command line when running the tests.

Run `mvn test` to run the tests.

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

