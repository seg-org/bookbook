import { Post } from "./post.dto";

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
};

export type CreateChatRoom = {
  subject: "post" | "report";
  subjectId: string;
};
