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

You can start the backend by executing `npm run restart` in the terminal. This will compile the
TypeScript code and start the server.

# TSOA

TSOA library is used to generate the client code for the APIs. This means you need to write your
controller code in a bit specific way. Then run `pnpm build` to generate the necessary router
code and OpenAPI specification.

# API documentation

The Swagger UI for API documentation is available at `/swagger-ui/index.html`.

The OpenAPI specification is available at `/openapi-docs`.

# Authentication

Authentication is done using JWT tokens. This backend does the JWT validation and checks the roles
(scopes). However, there are no authentication endpoints. One has to authenticate using the
authentication endpoints for the backend v1. The same token should be used for both backends.
For this to work it is critical that the same token signing key is used for both
backends (`JWT_SECRET_KEY` environment variable).