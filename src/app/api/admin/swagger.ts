import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { PostResponse, PostsResponse } from "@/app/api/posts/schemas";
import { BooksResponse } from "@/app/api/books/schemas";

export const adminRegistry = new OpenAPIRegistry();

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "get",
  path: "/admin/manage-post",
  summary: "/api/admin/manage-post",
  description: "Admin can view all posts.",
  request: {},
  responses: {
    200: {
      description: "Get all posts successfully.",
      content: {
        "application/json": {
          schema: z.object({
            Posts: PostsResponse,
            message: z.string().openapi({ example: "Get all posts successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "patch",
  path: "/admin/manage-post/{postId}",
  summary: "/api/admin/manage-post/{postId}",
  description: "Admin can edit a post.",
  request: {
    params: z.object({ postId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({ title: z.string().optional().openapi({ example: "Selling old copy of The Hobbit" }) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post edited successfully.",
      content: {
        "application/json": {
          schema: z.object({
            post: PostResponse,
            message: z.string().openapi({ example: "Post edited successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "delete",
  path: "/admin/manage-post/{postId}",
  summary: "/api/admin/manage-post/{postId}",
  description: "Admin can delete a post.",
  request: {
    params: z.object({ postId: z.string() }),
  },
  responses: {
    200: {
      description: "Post deleted successfully.",
      content: {
        "application/json": {
          schema: z.object({
            post: PostResponse,
            message: z.string().openapi({ example: "Post deleted successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "patch",
  path: "/admin/validate-refund/{transactionId}",
  summary: "/api/admin/validate-refund/{transactionId}",
  description: "Admin can approve/reject a refund request for a transaction.",
  request: {
    params: z.object({ transactionId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["APPROVED", "REJECTED"]),
            reason: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Refund request approved/rejected successfully.",
      content: {
        "application/json": {
          schema: z.object({
            transactionId: z.string().openapi({ example: "transaction_1" }),
            message: z.string().openapi({ example: "Refund approved successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "get",
  path: "/admin/dashboard",
  summary: "/api/admin/dashboard",
  description: "Admin can view the dashboard that contains aggregated metrics of the platform.",
  responses: {
    200: {
      description: "Get dashboard metrics successfully.",
      content: {
        "application/json": {
          schema: z.object({
            totalSales: z.number().openapi({ example: 100000 }),
            transactionCount: z.number().openapi({ example: 500 }),
            activeUsers: z.number().openapi({ example: 200 }),
            newUsersThisWeek: z.number().openapi({ example: 50 }),
            averageOrderValue: z.number().openapi({ example: 200 }),
            bookCount: z.number().openapi({ example: 1000 }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "get",
  path: "/admin/new-book",
  summary: "/api/admin/new-book",
  description: "Admin can view all new books.",
  responses: {
    200: {
      description: "Get all new books successfully.",
      content: {
        "application/json": {
          schema: z.object({
            books: BooksResponse,
            message: z.string().openapi({ example: "Get all new books successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  //
  tags: ["Admin"],
  method: "patch",
  path: "/admin/new-book/{bookId}",
  summary: "/api/admin/new-book/{bookId}",
  description: "Admin can edit a new book.",
  request: {
    params: z.object({ bookId: z.string() }),
  },
  responses: {
    200: {
      description: "Book edited successfully.",
      content: {
        "application/json": {
          schema: z.object({
            book: BooksResponse,
            message: z.string().openapi({ example: "Book edited successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "patch",
  path: "/admin/verify-seller/{userId}",
  summary: "/api/admin/verify-seller/{userId}",
  description:
    "Admin can approve or reject a seller profile. Approving updates the seller's status, while rejecting deletes the profile and updates the user.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            sellerId: z.string().openapi({ example: "seller_1" }),
            approved: z.boolean().openapi({ example: true }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Seller profile processed successfully",
      content: {
        "application/json": {
          schema: z.union([
            z.object({
              isApproved: z.boolean().openapi({ example: true }),
              approvedAt: z.string().datetime().optional().openapi({ example: "2025-04-16T12:00:00Z" }),
            }),
            z.object({
              message: z.string().openapi({ example: "Seller profile processed successfully" }),
            }),
          ]),
        },
      },
    },
    400: {
      description: "Invalid request data",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Invalid request data" }),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "get",
  path: "/admin/users",
  summary: "/api/admin/users",
  description: "Admin can view all users.",
  responses: {
    200: {
      description: "Get all users successfully.",
      content: {
        "application/json": {
          schema: z.object({
            users: z.array(
              z.object({
                id: z.string().openapi({ example: "user_1" }),
                email: z.string().openapi({ example: "john@gmail.com" }),
                firstName: z.string().openapi({ example: "John" }),
                lastName: z.string().openapi({ example: "Doe" }),
                password: z.string().openapi({ example: "password" }),
                phoneNumber: z.string().optional().openapi({ example: "0123456789" }),
                address: z.string().optional().openapi({ example: "123, Jalan ABC" }),
                isAdmin: z.boolean().openapi({ example: true }),
                isSeller: z.boolean().openapi({ example: true }),
                isVerified: z.boolean().openapi({ example: true }),
                emailVerified: z.date().optional().openapi({ example: "2021-09-30T15:00:00.000Z" }),
                phoneVerified: z.date().optional().openapi({ example: "2021-09-30T15:00:00.000Z" }),
                pdpaConsent: z.boolean().openapi({ example: true }),
                createdAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
                updatedAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
                bannedAt: z.string().nullable(),
                bannedReason: z.string().nullable(),
                _count: z.object({
                  buyTransactions: z.number(),
                  sellTransactions: z.number(),
                  posts: z.number(),
                }),
              }),
            ),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "patch",
  path: "/admin/users/{userId}",
  summary: "/api/admin/users/{userId}",
  description: "Admin can edit user profile.",
  request: {
    params: z.object({ userId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            address: z.string().optional(),
            bannedAt: z.string().nullable().optional(),
            bannedReason: z.string().nullable().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "User updated successfully.",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            message: z.string().openapi({ example: "User updated successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});

adminRegistry.registerPath({
  tags: ["Admin"],
  method: "patch",
  path: "/admin/users/{userId}/sellerProfile",
  summary: "/api/admin/users/{userId}/sellerProfile",
  description: "Admin can edit seller profile.",
  request: {
    params: z.object({ userId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            bankName: z.string().optional(),
            bankAccount: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "SellerProfile updated successfully.",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            message: z.string().openapi({ example: "SellerProfile updated successfully." }),
          }),
        },
      },
    },
    400: {
      description: "Bad request.",
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
});
