import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  CreateNotificationRequest,
  MarkAsReadRequest,
  NotificationResponse,
  NotificationsResponse,
} from "./schemas";

export const notificationRegistry = new OpenAPIRegistry();

notificationRegistry.registerPath({
  tags: ["Notifications"],
  method: "get",
  path: "/notifications",
  summary: "Get Notifications for a User",
  request: {
    query: z.object({
      userId: z.string().openapi({ example: "user_123" }),
    }),
  },
  responses: {
    200: {
      description: "List of Notifications",
      content: {
        "application/json": {
          schema: NotificationsResponse,
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "User ID is required" },
            },
          },
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Failed to fetch notifications" },
            },
          },
        },
      },
    },
  },
});

notificationRegistry.registerPath({
  tags: ["Notifications"],
  method: "post",
  path: "/notifications",
  summary: "Create a New Notification",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateNotificationRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Notification created successfully",
      content: {
        "application/json": {
          schema: NotificationResponse,
        },
      },
    },
    400: {
      description: "Invalid Input",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Invalid notification data" },
            },
          },
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Failed to create notification" },
            },
          },
        },
      },
    },
  },
});

notificationRegistry.registerPath({
  tags: ["Notifications"],
  method: "post",
  path: "/notifications/read",
  summary: "Mark Notification as Read",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MarkAsReadRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Notification marked as read successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
            },
          },
        },
      },
    },
    400: {
      description: "Invalid Input",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Invalid notification ID" },
            },
          },
        },
      },
    },
    500: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string", example: "Failed to mark notification as read" },
            },
          },
        },
      },
    },
  },
});
