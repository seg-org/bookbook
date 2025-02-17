import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateBookRequest = z
  .object({
    title: z.string().openapi({ example: "The Hobbit" }),
    author: z.string().openapi({ example: "J.R.R. Tolkien" }),
    genre: z.string().openapi({ example: "Fantasy" }),
    description: z.string().openapi({ example: "The Hobbit is a fantasy novel by J.R.R. Tolkien" }),
    isbn: z.string().openapi({ example: "978-3-16-148410-0" }),
    pages: z.number().openapi({ example: 310 }),
    publisher: z.string().openapi({ example: "George Allen & Unwin" }),
    coverImageKey: z.string().openapi({ example: "the-hobbit.jpg" }),
  })
  .openapi("CreateBook");

export const BookResponse = z
  .object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    description: z.string(),
    isbn: z.string(),
    pages: z.number(),
    publisher: z.string(),
    coverImageKey: z.string(),
    id: z.string(),
  })
  .openapi("Book");
