import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BookResponse } from "../books/schemas";
import { SpecialDescriptionType } from "../posts/post_enum";

extendZodWithOpenApi(z);

export const CreatePostRequest = z.object({
  title: z.string().openapi({ example: "Selling old copy of The Hobbit" }),
  content: z.string().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
  price: z.number().openapi({ example: 10.0 }),
  published: z.boolean().openapi({ example: true }),
  bookId: z.string().openapi({ example: "book_1" }),
  sellerId: z.string().openapi({ example: "user_1" }),
  specialDescriptions: z.array(SpecialDescriptionType).optional().openapi({ example: ["AUTHOR_SIGNATURE"] }),
  damageURLs: z.array(z.string()).optional().openapi({ example: ["https://example.com/damage1.jpg", "https://example.com/damage2.jpg"] }),
});

export const PostResponse = z.object({
  id: z.string().openapi({ example: "post_1" }),
  title: z.string().openapi({ example: "Selling old copy of The Hobbit" }),
  content: z.string().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
  price: z.number().openapi({ example: 10.0 }),
  published: z.boolean().openapi({ example: true }),
  bookId: z.string().openapi({ example: "book_1" }),
  sellerId: z.string().openapi({ example: "user_1" }),
  book: BookResponse,
  specialDescriptions: z.array(SpecialDescriptionType).optional().openapi({ example: ["AUTHOR_SIGNATURE"] }),
  damageURLs: z.array(z.string()).optional().openapi({ example: ["https://example.com/damage1.jpg", "https://example.com/damage2.jpg"] }),
});

export const PostsResponse = z.array(PostResponse);

export const UpdatePostRequest = z.object({
  title: z.string().optional().openapi({ example: "Selling old copy of The Hobbit" }),
  content: z.string().optional().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
  price: z.number().optional().openapi({ example: 10.0 }),
  published: z.boolean().optional().openapi({ example: true }),
  bookId: z.string().optional().openapi({ example: "book_1" }),
  specialDescriptions: z.array(SpecialDescriptionType).optional().openapi({ example: ["AUTHOR_SIGNATURE"] }),
  damageURLs: z.array(z.string()).optional().openapi({ example: ["https://example.com/damage1.jpg", "https://example.com/damage2.jpg"] }),
});
