import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BookResponse, BooksResponse, CreateBookRequest } from "./schemas";

export const bookRegistry = new OpenAPIRegistry();

bookRegistry.registerPath({
  method: "post",
  path: "/books",
  summary: "Creates a book",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBookRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Book created successfully.",
      content: {
        "application/json": {
          schema: BookResponse,
        },
      },
    },
  },
});

bookRegistry.registerPath({
  method: "get",
  path: "/books",
  summary: "Gets all books",
  responses: {
    200: {
      description: "Array of books.",
      content: {
        "application/json": {
          schema: BooksResponse,
        },
      },
    },
  },
});

bookRegistry.registerPath({
  method: "post",
  path: "/books/{id}",
  summary: "Get a single user",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: CreateBookRequest,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Object with user data.",
      content: {
        "application/json": {
          schema: BookResponse,
        },
      },
    },
  },
});
