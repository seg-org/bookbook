import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CreatePostRequest, PostResponse, PostsResponse } from "./schemas";

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
  method: "post",
  path: "/posts/{id}",
  summary: "Get a single user",
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: CreatePostRequest,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Object with user data.",
      content: {
        "application/json": {
          schema: PostResponse,
        },
      },
    },
  },
});
