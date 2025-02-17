import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CreatePostRequest, PostResponse, PostsResponse, UpdatePostRequest } from "./schemas";

export const postRegistry = new OpenAPIRegistry();

postRegistry.registerPath({
  tags: ["Posts"],
  method: "post",
  path: "/posts",
  summary: "Creates a post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePostRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Post created successfully.",
      content: {
        "application/json": {
          schema: PostResponse,
        },
      },
    },
  },
});

postRegistry.registerPath({
  tags: ["Posts"],
  method: "get",
  path: "/posts",
  summary: "Gets all posts",
  responses: {
    200: {
      description: "Array of posts.",
      content: {
        "application/json": {
          schema: PostsResponse,
        },
      },
    },
  },
});

postRegistry.registerPath({
  tags: ["Posts"],
  method: "get",
  path: "/posts/{id}",
  summary: "Get a single post",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "A single post.",
      content: {
        "application/json": {
          schema: PostResponse,
        },
      },
    },
  },
});

postRegistry.registerPath({
  tags: ["Posts"],
  method: "patch",
  path: "/posts/{id}",
  summary: "Updates a post",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: UpdatePostRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Post updated successfully.",
      content: {
        "application/json": {
          schema: PostResponse,
        },
      },
    },
  },
});

postRegistry.registerPath({
  tags: ["Posts"],
  method: "delete",
  path: "/posts/{id}",
  summary: "Deletes a post",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Post deleted successfully.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", example: "Post with id post_1 deleted successfully`" },
            },
          },
        },
      },
    },
  },
});

postRegistry.registerPath({
  tags: ["Posts"],
  method: "get",
  path: "/posts/recommend",
  summary: "Recommends posts",
  request: {
    query: z.object({ user_id: z.string().openapi({ example: "user_1" }) }),
  },
  responses: {
    200: {
      description: "Posts recommended successfully.",
      content: {
        "application/json": {
          schema: PostsResponse,
        },
      },
    },
  },
});
