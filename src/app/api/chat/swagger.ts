import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  ChatMessageResponse,
  ChatMessagesResponse,
  ChatRoomResponse,
  CreateChatMessageRequest,
  CreateChatRoomRequest,
  MyRoomsResponse,
  ReadMessageRequest,
} from "./schemas";

export const chatRegistry = new OpenAPIRegistry();

chatRegistry.registerPath({
  tags: ["Chats"],
  method: "post",
  path: "/chat",
  summary: "Creates a chat room",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateChatRoomRequest,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Chat room created successfully.",
      content: {
        "application/json": {
          schema: ChatRoomResponse,
        },
      },
    },
  },
});

chatRegistry.registerPath({
  tags: ["Chats"],
  method: "get",
  path: "/chat/my-rooms",
  summary: "Gets all my chat rooms",
  responses: {
    200: {
      description: "Array of chat rooms.",
      content: {
        "application/json": {
          schema: MyRoomsResponse,
        },
      },
    },
  },
});

chatRegistry.registerPath({
  tags: ["Chats"],
  method: "post",
  path: "/chats/{roomId}/messages",
  summary: "Get a single chat",
  request: {
    params: z.object({ roomId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: CreateChatMessageRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "A single chat message.",
      content: {
        "application/json": {
          schema: ChatMessageResponse,
        },
      },
    },
  },
});

chatRegistry.registerPath({
  tags: ["Chats"],
  method: "get",
  path: "/chats/{roomId}/messages",
  summary: "Get all messages in a chat room",
  request: {
    params: z.object({ roomId: z.string() }),
  },
  responses: {
    200: {
      description: "Array of chat messages.",
      content: {
        "application/json": {
          schema: ChatMessagesResponse,
        },
      },
    },
  },
});

chatRegistry.registerPath({
  tags: ["Chats"],
  method: "patch",
  path: "/chats/{roomId}/messages/read",
  summary: "Read all messages in a chat room for current user",
  request: {
    params: z.object({ roomId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: ReadMessageRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Chat room updated successfully.",
      content: {
        "application/json": {
          schema: ChatRoomResponse,
        },
      },
    },
  },
});
