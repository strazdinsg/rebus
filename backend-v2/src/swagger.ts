import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API documentation",
      version: "1.0.0",
      description: "Rebus backend API documentation",
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwaggerDocs;
