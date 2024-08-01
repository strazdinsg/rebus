# Rebus backend, v2

The version 2 of backend for the [Rebus system](..). A Node.js application.

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
    - SERVER_PORT - port number to run the server on
    - ALLOWED_ORIGINS - comma-separated list of allowed origins for CORS

Then you need to link this project to the [schemas](../schemas) project. This can be done by
running `npm link` in the schemas project directory, then running `npm link schemas` in this
project directory. The reason for this is that this project needs to access the schemas package
because it needs the Data Transfer Objects (DTOs) defined in the schemas package.

You can start the backend by executing `npm run restart` in the terminal. This will compile the
TypeScript code and start the server.

# API documentation

The Swagger UI for API documentation is available at `/swagger-ui/index.html`.

The OpenAPI specification is available at `/openapi-docs.json`.