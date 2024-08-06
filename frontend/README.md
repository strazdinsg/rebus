# Rebus frontend

The visible user interface (frontend) of the project. Uses React JS framework.

## Getting Started

You need to provide the following environment variables:

* `VITE_API_V1_BASE_URL`. It needs to point to the location of your backend, version 1 (Spring
  Boot).
* `VITE_API_V2_BASE_URL`. It needs to point to the location of your backend, version 2 (Node.js,
  Express).
* `VITE_SERVER_PORT` - TCP port number to use for the development-run of the frontend with Vite
  (The one you launch with `npm run start`).

For example:

```
VITE_API_V1_BASE_URL=http://localhost:8080
VITE_API_V2_BASE_URL=http://localhost:3000
VITE_SERVER_PORT=80
```

The easiest way is to store it inside `.env` file. Note: the value in the `.env` file will be only
considered when you run or build the application. You can't update it after the frontend application
is already running!

Then you need to generate the client code for the APIs: run `pnpm orval:generate` in this project
directory. This will generate the client code for the APIs in the `src/api-v1` and `src/api-v2`
directories.

### Launching the application

You can launch the development version of the application with `pnpm start`.

## Authentication

JSON Web token (JWT) authentication is used, with `Authorization: Bearer {jwt}` header.
[README.md](..%2Fbackend%2FREADME.md)
