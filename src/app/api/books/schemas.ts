import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const GenreType = z.enum([
  "FICTION",
  "NON_FICTION",
  "MYSTERY",
  "THRILLER",
  "ROMANCE",
  "SCIENCE_FICTION",
  "FANTASY",
  "HISTORICAL_FICTION",
  "HORROR",
  "BIOGRAPHY",
  "MEMOIR",
  "SELF_HELP",
  "HEALTH_WELLNESS",
  "PSYCHOLOGY",
  "POETRY",
  "DRAMA",
  "ADVENTURE",
  "CHILDRENS_LITERATURE",
  "YOUNG_ADULT",
  "GRAPHIC_NOVELS_COMICS",
  "CRIME",
  "TRUE_CRIME",
  "DYSTOPIAN",
  "CONTEMPORARY",
  "RELIGIOUS_SPIRITUAL",
]);

const BookTagType = z.enum([
  "BESTSELLER",
  "NEW_RELEASE",
  "CLASSIC",
  "AWARD_WINNING",
  "MUST_READ",
  "HIGHLY_RECOMMENDED",
  "INSPIRATIONAL",
  "COMING_OF_AGE",
  "FAMILY_SAGA",
  "HISTORICAL",
  "DARK_FANTASY",
  "DETECTIVE",
  "LGBTQ_PLUS",
  "YOUNG_ADULT",
  "CHILDRENS_BOOK",
  "SHORT_STORIES",
  "MYSTERY",
  "SELF_HELP",
  "THRILLER",
  "ROMANTIC_COMEDY",
]);

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
