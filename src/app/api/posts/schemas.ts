import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { BookResponse } from "../books/schemas";

extendZodWithOpenApi(z);

const SpecialDescriptionType = z.enum([
  "AUTHOR_SIGNATURE",
  "LIMITED_EDITION",
  "FIRST_EDITION",
  "SPECIAL_COVER_ART",
  "ILLUSTRATED_EDITION",
  "COLLECTORS_EDITION",
  "SLIPCASE_EDITION",
  "LEATHER_BOUND",
  "GILDED_EDGES",
  "DECKLE_EDGES",
  "POP_UP_ELEMENTS",
  "FOLD_OUT_PAGES",
  "HANDWRITTEN_NOTES_BY_AUTHOR",
  "PERSONALIZED_MESSAGE",
  "NUMBERED_EDITION",
  "EXCLUSIVE_ARTWORK",
  "EMBOSSED_COVER",
  "GOLD_FOIL_STAMPING",
  "BOX_SET",
  "ANNIVERSARY_EDITION",
  "HARDCOVER_WITH_DUST_JACKET",
  "TRANSPARENT_COVER",
  "ANNOTATED_EDITION",
  "SIGNED_BY_ILLUSTRATOR",
  "MAP_INSERT",
  "SUPPLEMENTARY_MATERIALS",
  "EXCLUSIVE_CONTENT",
  "FAN_ART_EDITION",
  "INTERACTIVE_ELEMENTS",
  "BILINGUAL_EDITION",
]);

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
