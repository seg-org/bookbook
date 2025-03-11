import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  CreateReviewRequest,
  GetReviewsRequest,
  ReviewResponse,
  ReviewsResponse,
  ReviewStatsResponse,
  UpdateReviewRequest,
} from "./schemas";

export const reviewRegistry = new OpenAPIRegistry();

reviewRegistry.registerPath({
  tags: ["Review"],
  method: "post",
  path: "/reviews",
  summary: "Creates a review for a completed transaction",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateReviewRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Review created successfully.",
      content: {
        "application/json": {
          schema: ReviewResponse,
        },
      },
    },
    400: {
      description: "Invalid request or transaction not eligible for review.",
    },
    404: {
      description: "Transaction not found.",
    },
  },
});

reviewRegistry.registerPath({
  tags: ["Review"],
  method: "get",
  path: "/reviews",
  summary: "Query reviews with optional filtering",
  request: {
    query: GetReviewsRequest,
  },
  responses: {
    200: {
      description: "Array of reviews matching the query.",
      content: {
        "application/json": {
          schema: ReviewsResponse,
        },
      },
    },
  },
});

reviewRegistry.registerPath({
  tags: ["Review"],
  method: "get",
  path: "/reviews/{id}",
  summary: "Get a single review",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "A single review with transaction details.",
      content: {
        "application/json": {
          schema: ReviewResponse,
        },
      },
    },
    404: {
      description: "Review not found.",
    },
  },
});

reviewRegistry.registerPath({
  tags: ["Review"],
  method: "patch",
  path: "/reviews/{id}",
  summary: "Updates a review",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: UpdateReviewRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Review updated successfully.",
      content: {
        "application/json": {
          schema: ReviewResponse,
        },
      },
    },
    404: {
      description: "Review not found.",
    },
  },
});

reviewRegistry.registerPath({
  tags: ["Review"],
  method: "delete",
  path: "/reviews/{id}",
  summary: "Deletes a review",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Review deleted successfully.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    404: {
      description: "Review not found.",
    },
  },
});

reviewRegistry.registerPath({
  tags: ["Review"],
  method: "get",
  path: "/reviews/stats/{sellerId}",
  summary: "Get review statistics for a seller",
  request: {
    params: z.object({ sellerId: z.string() }),
  },
  responses: {
    200: {
      description: "Seller review statistics.",
      content: {
        "application/json": {
          schema: ReviewStatsResponse,
        },
      },
    },
    404: {
      description: "Seller not found.",
    },
  },
});
