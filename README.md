# Rebus

Rebus management system, with a web-based user interface. First used in CFlow Påske Rebus 2023, organised by Inguna
Strazdina.

The solution consists of a [React frontend](frontend) and a [Spring Boot backend](backend). See the setup instructions
in each sub-project folder.

## Disclaimer

This is a hobby project, made for a specific event. Therefore, some things which you would expect in a commercial
product are not there. You are free to use the project as is, or extend it as you like.

The following important things are identified as missing:

- Logout functionality
- Invalidation of tokens
- Team management for the admin
- Auto-generated admin user
- The answer and score DTOs are implemented in a bit weird way (as arrays) and they assume that challenges are always
  numbered from 1 and onwards. I.e., the system won't work if you would have challenges with ID 2, 7, 12 and 18, for
  example.
