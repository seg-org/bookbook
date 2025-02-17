import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  BookResponse,
  BooksResponse,
  CreateBookRequest,
  GenBookDescRequest,
  GenBookDescResponse,
  UpdateBookRequest,
} from "./schemas";

export const bookRegistry = new OpenAPIRegistry();

bookRegistry.registerPath({
  tags: ["Books"],
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
  tags: ["Books"],
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
  tags: ["Books"],
  method: "get",
  path: "/books/{id}",
  summary: "Get a single book",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "A single book.",
      content: {
        "application/json": {
          schema: BookResponse,
        },
      },
    },
  },
});

bookRegistry.registerPath({
  tags: ["Books"],
  method: "patch",
  path: "/books/{id}",
  summary: "Updates a book",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: UpdateBookRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Book updated successfully.",
      content: {
        "application/json": {
          schema: BookResponse,
        },
      },
    },
  },
});

bookRegistry.registerPath({
  tags: ["Books"],
  method: "delete",
  path: "/books/{id}",
  summary: "Deletes a book",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Book deleted successfully.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: "Book with id book_1 deleted successfully`" },
            },
          },
        },
      },
    },
  },
});

bookRegistry.registerPath({
  tags: ["Books"],
  method: "post",
  path: "/books/gen-description",
  summary: "Generates description for title",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GenBookDescRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Description generated successfully.",
      content: {
        "application/json": {
          schema: GenBookDescResponse,
        },
      },
    },
  },
});
