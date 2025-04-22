import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";

import { adminRegistry } from "@/app/api/admin/swagger";
import { bookmarkRegistry } from "@/app/api/bookmarks/swagger";
import { bookRegistry } from "@/app/api/books/swagger";
import { chatRegistry } from "@/app/api/chat/swagger";
import { objectRegistry } from "@/app/api/objects/swagger";
import { postRegistry } from "@/app/api/posts/swagger";
import { transactionRegistry } from "@/app/api/transaction/swagger";

export const getApiDocs = async () => {
  const generator = new OpenApiGeneratorV3([
    ...bookRegistry.definitions,
    ...postRegistry.definitions,
    ...objectRegistry.definitions,
    ...bookmarkRegistry.definitions,
    ...chatRegistry.definitions,
    ...transactionRegistry.definitions,
    ...adminRegistry.definitions,
  ]);
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
