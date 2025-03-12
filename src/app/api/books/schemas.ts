import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BookTagType, GenreType } from "../books/book_enum";

extendZodWithOpenApi(z);

export const CreateBookRequest = z.object({
  title: z.string().openapi({ example: "The Hobbit" }),
  author: z.string().openapi({ example: "J.R.R. Tolkien" }),
  genre: z.string().openapi({ example: "Fantasy" }),
  description: z.string().openapi({ example: "The Hobbit is a fantasy novel by J.R.R. Tolkien" }),
  isbn: z.string().openapi({ example: "9783161484100" }),
  pages: z.number().openapi({ example: 310 }),
  publisher: z.string().openapi({ example: "George Allen & Unwin" }),
  coverImageKey: z.string().openapi({ example: "the-hobbit.jpg" }),
  bookGenres: z.array(GenreType).optional().openapi({ example: ["FANTASY", "ADVENTURE"] }),
  bookTags: z.array(BookTagType).optional().openapi({ example: ["BESTSELLER"] }),
});

export const BookResponse = z.object({
  id: z.string().openapi({ example: "book_1" }),
  title: z.string().openapi({ example: "The Hobbit" }),
  author: z.string().openapi({ example: "J.R.R. Tolkien" }),
  genre: z.string().openapi({ example: "Fantasy" }),
  description: z.string().openapi({ example: "The Hobbit is a fantasy novel by J.R.R. Tolkien" }),
  isbn: z.string().openapi({ example: "9783161484100" }),
  pages: z.number().openapi({ example: 310 }),
  publisher: z.string().openapi({ example: "George Allen & Unwin" }),
  coverImageKey: z.string().openapi({ example: "the-hobbit.jpg" }),
  coverImageUrl: z.string().openapi({ example: "https://example.com/the-hobbit.jpg" }),
  bookGenres: z.array(GenreType).optional().openapi({ example: ["FANTASY", "ADVENTURE"] }),
  bookTags: z.array(BookTagType).optional().openapi({ example: ["BESTSELLER"] }),
});

export const BooksResponse = z.array(BookResponse);

export const UpdateBookRequest = z.object({
  title: z.string().optional().openapi({ example: "The Hobbit" }),
  author: z.string().optional().openapi({ example: "J.R.R. Tolkien" }),
  genre: z.string().optional().openapi({ example: "Fantasy" }),
  description: z.string().optional().openapi({ example: "The Hobbit is a fantasy novel by J.R.R. Tolkien" }),
  isbn: z.string().optional().openapi({ example: "9783161484100" }),
  pages: z.number().optional().openapi({ example: 310 }),
  coverImageKey: z.string().optional().openapi({ example: "the-hobbit.jpg" }),
  bookGenres: z.array(GenreType).optional().openapi({ example: ["FANTASY", "ADVENTURE"] }),
  bookTags: z.array(BookTagType).optional().openapi({ example: ["BESTSELLER"] }),
});

export const GenBookDescRequest = z.object({
  title: z.string().openapi({ example: "The Hobbit" }),
});

export const GenBookDescResponse = z.object({
  title: z.string().openapi({ example: "The Hobbit" }),
  description: z.string().openapi({ example: "The Hobbit is a fantasy novel by J.R.R. Tolkien" }),
});
