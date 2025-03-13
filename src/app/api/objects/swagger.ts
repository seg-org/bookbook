import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { PutObjectResponse } from "./schemas";

export const objectRegistry = new OpenAPIRegistry();

objectRegistry.registerPath({
  tags: ["Objects"],
  method: "put",
  path: "/objects",
  summary: "Put a file to S3",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.string().openapi({ example: "file.jpg (as FILE, not string)" }),
            folder: z.string().openapi({ example: "book_images" }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "File uploaded successfully.",
      content: {
        "application/json": {
          schema: PutObjectResponse,
        },
      },
    },
  },
});
