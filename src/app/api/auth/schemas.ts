import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserResponse = z.object({
  id: z.string().openapi({ example: "user_1" }),
  email: z.string().openapi({ example: "john@gmail.com" }),
  firstName: z.string().openapi({ example: "John" }),
  lastName: z.string().openapi({ example: "Doe" }),
  password: z.string().openapi({ example: "password" }),
  phoneNumber: z.string().optional().openapi({ example: "0123456789" }),
  address: z.string().optional().openapi({ example: "123, Jalan ABC" }),
  isAdmin: z.boolean().openapi({ example: true }),
  isSeller: z.boolean().openapi({ example: true }),
  isVerified: z.boolean().openapi({ example: true }),
  emailVerified: z.date().optional().openapi({ example: "2021-09-30T15:00:00.000Z" }),
  phoneVerified: z.date().optional().openapi({ example: "2021-09-30T15:00:00.000Z" }),
  pdpaConsent: z.boolean().openapi({ example: true }),
  createdAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  updatedAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
});
