import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { BookTagType, GenreType } from "../books/book_enum";
import { BookResponse } from "../books/schemas";
import { SpecialDescriptionType } from "../posts/post_enum";

extendZodWithOpenApi(z);

const DamageEnumType = z.enum(["NO_DAMAGED", "SLIGHTLY_DAMAGED", "DAMAGED"]);

export const GetPostsRequest = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  isbn: z.string().optional(),
  minPages: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  maxPages: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  pages: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  publisher: z.string().optional(),
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().min(1).default(1)),
  limit: z.preprocess((val) => (val ? Number(val) : 10), z.number().min(1).max(30).default(30)),
  sortBy: z.enum(["createdAt", "price"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  bookGenres: z
    .array(GenreType)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  bookTags: z
    .array(BookTagType)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  specialDescriptions: z
    .array(SpecialDescriptionType)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined))
    .openapi({ example: ["AUTHOR_SIGNATURE"] }),
  verifiedStatus: z.string().optional(),
  postId: z.string().optional(),
});

export const CreatePostRequest = z.object({
  title: z.string().min(5).openapi({ example: "Selling old copy of The Hobbit" }),
  content: z.string().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
  price: z.number().min(1).openapi({ example: 10.0 }),
  published: z.boolean().openapi({ example: true }),
  bookId: z.string().openapi({ example: "book_1" }),
  sellerId: z.string().openapi({ example: "user_1" }),
  specialDescriptions: z
    .array(SpecialDescriptionType)
    .transform((val) => (val ? val : []))
    .openapi({ example: ["AUTHOR_SIGNATURE"] }),
  damageURLs: z
    .array(z.string())
    .transform((val) => (val ? val : []))
    .openapi({ example: ["https://example.com/damage1.jpg", "https://example.com/damage2.jpg"] }),
  damage: DamageEnumType.openapi({ example: "SLIGHTLY_DAMAGED" }),
});

export const PostResponse = z.object({
  id: z.string().openapi({ example: "post_1" }),
  title: z.string().openapi({ example: "Selling old copy of The Hobbit" }),
  content: z.string().nullish().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
  price: z.number().openapi({ example: 10.0 }),
  published: z.boolean().openapi({ example: true }),
  bookId: z.string().openapi({ example: "book_1" }),
  sellerId: z.string().openapi({ example: "user_1" }),
  book: BookResponse,
  specialDescriptions: z.array(SpecialDescriptionType).openapi({ example: ["AUTHOR_SIGNATURE"] }),
  damageURLs: z
    .array(z.string())
    .openapi({ example: ["https://example.com/damage1.jpg", "https://example.com/damage2.jpg"] }),
  damage: DamageEnumType.openapi({ example: "NO_DAMAGED" }),
  verifiedStatus: z.string().openapi({ example: "VERIFIED" }),
  createdAt: z.date().openapi({ example: "2025-04-01T10:00:00Z" }),
  updatedAt: z.date().openapi({ example: "2025-04-01T10:00:00Z" }),
});

export const PostsResponse = z.array(PostResponse);

export const PostsResponsePaginated = z.object({
  posts: PostsResponse,
  total: z.number(),
  totalPages: z.number(),
  page: z.number(),
});

export const UpdatePostRequest = z.object({
  title: z.string().optional().openapi({ example: "Selling old copy of The Hobbit" }),
  content: z.string().optional().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
  price: z.number().optional().openapi({ example: 10.0 }),
  published: z.boolean().optional().openapi({ example: true }),
  bookId: z.string().optional().openapi({ example: "book_1" }),
  specialDescriptions: z
    .array(SpecialDescriptionType)
    .optional()
    .openapi({ example: ["AUTHOR_SIGNATURE"] }),
  damageURLs: z
    .array(z.string())
    .optional()
    .openapi({ example: ["https://example.com/damage1.jpg", "https://example.com/damage2.jpg"] }),
  damage: DamageEnumType.optional().openapi({ example: "DAMAGED" }),
  verifiedStatus: z.string().optional().openapi({ example: "VERIFIED" }),
});
