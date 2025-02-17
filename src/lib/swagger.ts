import { createSwaggerSpec } from "next-swagger-doc";

export const getSwaggerSpec = async () => {
  return createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next.js API Docs",
        version: "1.0.0",
      },
    },
  });
};
