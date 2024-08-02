import { defineConfig } from "orval";

export default defineConfig({
  api_v1: {
    input: "../backend/doc/openapi-docs.json",
    output: {
      mode: "tags-split",
      target: "src/api-v1/endpoints",
      schemas: "src/api-v1/models",
      client: "axios",
      prettier: true,
      override: {
        mutator: {
          path: "src/api-v1/apiClient.ts",
          name: "customAxiosClient",
        },
      },
    },
  },
  api_v2: {
    input: "../backend-v2/doc/openapi-docs.json",
    output: {
      mode: "tags-split",
      target: "src/api-v2/endpoints",
      schemas: "src/api-v2/models",
      client: "axios",
      prettier: true,
      override: {
        mutator: {
          path: "src/api-v2/apiClient.ts",
          name: "customAxiosClient",
        },
      },
    },
  },
});
