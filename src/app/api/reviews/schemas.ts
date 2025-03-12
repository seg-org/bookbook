import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateReviewRequest = z.object({
  transactionId: z.string().openapi({ example: "transaction_1" }),
  rating: z.number().min(1).max(5).openapi({ example: 4 }),
  comment: z.string().optional().openapi({ example: "Great seller, fast shipping!" }),
});

export const ReviewResponse = z.object({
  id: z.string().openapi({ example: "review_1" }),
  transactionId: z.string().openapi({ example: "transaction_1" }),
  rating: z.number().openapi({ example: 4 }),
  comment: z.string().nullable().openapi({ example: "Great seller, fast shipping!" }),
  createdAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  updatedAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
});

export const GetReviewsRequest = z.object({
  sellerId: z.string().optional().openapi({ example: "seller_1" }),
  skip: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(parseInt(val), 0) : 0))
    .openapi({ example: "0" }),
  take: z
    .string()
    .optional()
    .transform((val) => (val ? Math.max(parseInt(val), 0) : 10))
    .openapi({ example: "10" }),
});

export const ReviewsResponse = z.array(ReviewResponse);

export const UpdateReviewRequest = z.object({
  rating: z.number().min(1).max(5).optional().openapi({ example: 5 }),
  comment: z.string().optional().openapi({ example: "Even better than I initially thought!" }),
});

export const ReviewStatsResponse = z.object({
  sellerId: z.string().openapi({ example: "seller_1" }),
  averageRating: z.number().openapi({ example: 4.5 }),
  totalReviews: z.number().openapi({ example: 20 }),
  ratingCounts: z.array(
    z.object({
      rating: z.number().openapi({ example: 5 }),
      count: z.number().openapi({ example: 15 }),
    })
  ),
});
