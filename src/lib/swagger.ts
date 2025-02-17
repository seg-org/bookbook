import { BookResponse, CreateBookRequest } from "@/app/api/books/schemas";
import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next.js API Docs",
        version: "1.0.0",
      },
      components: {
        schemas: {
          CreateBook: CreateBookRequest.openapi("CreateBook"),
          Book: BookResponse.openapi("Book"),
        },
      },
    },
  });
};
