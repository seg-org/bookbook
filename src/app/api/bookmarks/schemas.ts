import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateBookmarkRequest = z.object({
  postId: z.string().openapi({ example: "post_1" }),
});

export const BookmarkResponse = z.object({
  postId: z.string().openapi({ example: "post_1" }),
  userId: z.string().openapi({ example: "user_1" }),
  createdAt: z.string().openapi({ example: "2021-09-01T00:00:00.000Z" }),
});

export const BookmarksResponse = z.array(BookmarkResponse);
