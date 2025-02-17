import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BookResponse } from "../books/schemas";

extendZodWithOpenApi(z);

export const CreatePostRequest = z
  .object({
    title: z.string().openapi({ example: "Selling old copy of The Hobbit" }),
    content: z.string().openapi({ example: "Selling my old copy of The Hobbit. It's in good condition." }),
    price: z.number().openapi({ example: 10.0 }),
    published: z.boolean().openapi({ example: true }),
    bookId: z.string().openapi({ example: "book_1" }),
    sellerId: z.string().openapi({ example: "user_1" }),
  })
  .openapi("CreatePost");

// export type Post = {
//   id: string;
//   title: string;
//   content: string;
//   price: number;
//   published: boolean;
//   bookId: string;
//   book: Book;
//   sellerId: string;
// };

export const PostResponse = z
  .object({
    id: z.string().openapi({ example: "post_1" }),
    book: BookResponse,
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
  .openapi("Post");

export const PostsResponse = z.array(PostResponse).openapi("Posts");
