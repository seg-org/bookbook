import { bookRegistry } from "@/app/api/books/swagger";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

export const getApiDocs = async () => {
  const generator = new OpenApiGeneratorV3([...bookRegistry.definitions]);
  const config = {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Docs",
      version: "1.0.0",
    },
  };

  return generator.generateDocument(config);
};
