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

You can start the backend by executing `mvn spring-boot:run` in the terminal. 

During development can simply run `RebusApplication.main()` method from your IDE.