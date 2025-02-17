import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { UserResponse } from "../auth/schemas";
import { PostResponse } from "../posts/schemas";

extendZodWithOpenApi(z);

export const CreateChatRoomRequest = z.object({
  subject: z.enum(["post", "report"]),
  subjectId: z.string(),
});

export const CreateChatMessageRequest = z.object({
  message: z.string().openapi({ example: "Hello, how are you?" }),
  roomId: z.string().openapi({ example: "chatroom_1" }),
});

export const ChatMessageResponse = z.object({
  id: z.string().openapi({ example: "message_1" }),
  message: z.string().openapi({ example: "Hello, how are you?" }),
  createdAt: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
  roomId: z.string().openapi({ example: "chatroom_1" }),
  senderId: z.string().openapi({ example: "user_1" }),
});

export const ChatMessagesResponse = z.array(ChatMessageResponse);

export const ChatRoomResponse = z.object({
  id: z.string().openapi({ example: "chatroom_1" }),
  createdAt: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
  postId: z.string().openapi({ example: "post_1" }),
  userIds: z.array(z.string()).openapi({ example: ["user_1", "user_2"] }),
  lastReadA: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
  lastReadB: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
});

export const ChatRoomsResponse = z.array(ChatRoomResponse);

export const MyRoomsResponse = z.array(
  z.object({
    id: z.string().openapi({ example: "chatroom_1" }),
    createdAt: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
    postId: z.string().openapi({ example: "post_1" }),
    userIds: z.array(z.string()).openapi({ example: ["user_1", "user_2"] }),
    lastReadA: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
    lastReadB: z.date().openapi({ example: "2021-09-30T15:00:00.000Z" }),
    post: PostResponse,
    userB: UserResponse,
    lastMessage: ChatMessageResponse,
  })
);

export const ReadMessageRequest = z.object({
  userId: z.string(),
});
