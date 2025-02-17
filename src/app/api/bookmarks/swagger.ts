import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BookmarkResponse, BookmarksResponse, CreateBookmarkRequest } from "./schemas";

export const bookmarkRegistry = new OpenAPIRegistry();

bookmarkRegistry.registerPath({
  tags: ["Bookmarks"],
  method: "post",
  path: "/bookmarks",
  summary: "Creates a bookmark",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBookmarkRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Bookmark created successfully.",
      content: {
        "application/json": {
          schema: BookmarkResponse,
        },
      },
    },
  },
});

bookmarkRegistry.registerPath({
  tags: ["Bookmarks"],
  method: "get",
  path: "/bookmarks",
  summary: "Gets all bookmarks",
  responses: {
    200: {
      description: "Array of bookmarks.",
      content: {
        "application/json": {
          schema: BookmarksResponse,
        },
      },
    },
  },
});
