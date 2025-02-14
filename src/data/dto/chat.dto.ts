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
};

export type CreateChatRoom = {
  subject: "post" | "report";
  subjectId: string;
  userId: string;
};
