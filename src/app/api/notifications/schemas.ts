import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CreateNotificationRequest = z.object({
  userId: z.string().openapi({ example: "user_123"}),
  message: z.string().openapi({ example: "Your post has been purchased." }),
  link: z.string().url().optional().openapi({ example: "/posts/123" }),
});

export const MarkAsReadRequest = z.object({
  id: z.string().openapi({ example: "notification_123" }),
});

export const NotificationResponse = z.object({
  id: z.string().openapi({ example: "notification_123" }),
  userId: z.string().openapi({ example: "user_123" }),
  message: z.string().openapi({ example: "Your post has been purchased." }),
  link: z.string().url().nullable().openapi({ example: "/posts/123" }),
  isRead: z.boolean().openapi({ example: false }),
  createdAt: z.date().openapi({ example: "2025-04-08T12:00:00.000Z" }),
});

export const NotificationsResponse = z.array(NotificationResponse);
