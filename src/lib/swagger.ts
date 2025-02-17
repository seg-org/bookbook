import { bookRegistry } from "@/app/api/books/swagger";
import { postRegistry } from "@/app/api/posts/swagger";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";

export const getApiDocs = async () => {
  const generator = new OpenApiGeneratorV3([...bookRegistry.definitions, ...postRegistry.definitions]);
  const config: OpenAPIObjectConfig = {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Docs",
      version: "1.0.0",
    },
    servers: [{ url: "/api" }],
  };

  return generator.generateDocument(config);
};
