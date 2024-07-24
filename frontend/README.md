# Rebus frontend

The visible user interface (frontend) of the project. Uses React JS framework.

## Getting Started

You need to provide the following environment variable: `VITE_API_BASE_URL`. It needs to point to
the location of your backend. For example:

```
VITE_API_BASE_URL=http://localhost:8080
```

The easiest way is to store it inside `.env` file. Note: the value in the `.env` file will be only
considered when you run or build the application. You can't update it after the frontend application
is already running!

## Authentication

JSON Web token (JWT) authentication is used, with `Authorization: Bearer {jwt}` header.
[README.md](..%2Fbackend%2FREADME.md)
