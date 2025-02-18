import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const PutObjectResponse = z.object({
  folder: z.string().openapi({ example: "book_images" }),
  key: z.string().openapi({ example: "the-hobbit.jpg" }),
});
