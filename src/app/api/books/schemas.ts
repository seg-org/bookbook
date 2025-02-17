import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateBookRequest = z
  .object({
    title: z.string().openapi({ example: "The Hobbit" }),
    author: z.string().openapi({ example: "J.R.R. Tolkien" }),
    genre: z.string().openapi({ example: "Fantasy" }),
    description: z.string().openapi({ example: "The Hobbit is a fantasy novel by J.R.R. Tolkien" }),
    isbn: z.string().openapi({ example: "9783161484100" }),
    pages: z.number().openapi({ example: 310 }),
    publisher: z.string().openapi({ example: "George Allen & Unwin" }),
    coverImageKey: z.string().openapi({ example: "the-hobbit.jpg" }),
  })
  .openapi("CreateBook");

export const BookResponse = z
  .object({
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
  })
  .openapi("Book");

export const BooksResponse = z.array(BookResponse).openapi("Books");
