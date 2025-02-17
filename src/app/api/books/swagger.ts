import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CreateBookRequest } from "./schemas";

export const bookRegistry = new OpenAPIRegistry();

bookRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  summary: "Get a single user",
  request: {
    params: z.object({ id: z.string() }),
  },

  responses: {
    200: {
      description: "Object with user data.",
      content: {
        "application/json": {
          schema: CreateBookRequest,
        },
      },
    },
  },
});
