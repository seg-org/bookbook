import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  CreateTransactionRequest,
  GetTransactionCountRequest,
  GetTransactionRequest,
  TransactionCountRespone,
  TransactionCreateRespone,
  TransactionRespone,
  TransactionsRespone,
  TransactionUpdateRespone,
  UpdateTransactionRequest,
} from "./schemas";

export const transactionRegistry = new OpenAPIRegistry();

transactionRegistry.registerPath({
  tags: ["Transaction"],
  method: "post",
  path: "/transaction",
  summary: "Creates a transaction",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTransactionRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Transaction created successfully.",
      content: {
        "application/json": {
          schema: TransactionCreateRespone,
        },
      },
    },
  },
});

transactionRegistry.registerPath({
  tags: ["Transaction"],
  method: "get",
  path: "/transaction",
  summary: "Query transactions",
  request: {
    query: GetTransactionRequest,
  },
  responses: {
    200: {
      description: "Array of query transactions.",
      content: {
        "application/json": {
          schema: TransactionsRespone,
        },
      },
    },
  },
});

transactionRegistry.registerPath({
  tags: ["Transaction"],
  method: "get",
  path: "/transaction/{id}",
  summary: "Get a single transaction",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "A single transaction.",
      content: {
        "application/json": {
          schema: TransactionRespone,
        },
      },
    },
  },
});

transactionRegistry.registerPath({
  tags: ["Transaction"],
  method: "patch",
  path: "/posts/{id}",
  summary: "Updates a transaction",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: UpdateTransactionRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Transaction updated successfully.",
      content: {
        "application/json": {
          schema: TransactionUpdateRespone,
        },
      },
    },
  },
});

transactionRegistry.registerPath({
  tags: ["Transaction"],
  method: "delete",
  path: "/transaction/{id}",
  summary: "Deletes a transaction",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Transaction deleted successfully.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: "Transaction with id 1 deleted successfully" },
            },
          },
        },
      },
    },
  },
});

transactionRegistry.registerPath({
  tags: ["Transaction"],
  method: "get",
  path: "/transaction/count",
  summary: "Transaction count",
  request: {
    query: GetTransactionCountRequest,
  },
  responses: {
    200: {
      description: "Posts recommended successfully.",
      content: {
        "application/json": {
          schema: TransactionCountRespone,
        },
      },
    },
  },
});
