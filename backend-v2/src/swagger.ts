import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { version } from "./version.js";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API documentation",
      version: version,
      description: "Rebus backend API documentation",
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app: Application) => {
  app.use(
    "/swagger-ui/index.html",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  app.use("/swagger-ui", (req, res) => {
    res.redirect("/swagger-ui/index.html");
  });

  app.use("/openapi-docs", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default setupSwaggerDocs;
