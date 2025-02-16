import { Post } from "./post.dto";
import { User } from "./user.dto";

export type ChatMessage = {
  id: string;
  senderId: string;
  roomId: string;
  message: string;
  createdAt: Date;
};

export type ChatRoom = {
  id: string;
  postId: string;
  userIds: string[];
  post: Post;
  userB: User;
  lastMessage: ChatMessage | null;
  lastReadA: Date;
  lastReadB: Date;
  createdAt: Date;
};

export type CreateChatRoom = {
  subject: "post" | "report";
  subjectId: string;
};
