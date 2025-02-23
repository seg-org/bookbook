import { useChannel } from "ably/react";
import { useMemo, useState } from "react";

import { useChatContext } from "@/context/chatContext";

import { ChatRoomCard } from "./ChatRoomCard";
import { ChatRoomSkeleton } from "./ChatRoomSkeleton";

type ChatRoomListProps = {
  userId: string;
};

export const ChatRoomList = ({ userId }: ChatRoomListProps) => {
  const { currentChatRoom, chatRooms, loading, error, updateChatRoomLastMessage } = useChatContext();
  // roomId = room id of the most recent message from any room
  const [roomId, setRoomId] = useState<string | null>(null);

  const sortedChatRooms = useMemo(() => {
    return [...chatRooms].sort((a, b) => {
      if (a.id === roomId) return -1;
      if (b.id === roomId) return 1;
      if (a.lastMessage && b.lastMessage) return b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime();
      if (a.lastMessage) return b.createdAt.getTime() - a.lastMessage.createdAt.getTime();
      if (b.lastMessage) return b.lastMessage.createdAt.getTime() - a.createdAt.getTime();
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [chatRooms, roomId]);

  useChannel("chat", (message) => {
    const messageId = message.id as string;
    const roomId: string = message.data.roomId;
    const messageText: string = message.data.message;
    const senderId: string = message.data.senderId;
    updateChatRoomLastMessage(messageId, roomId, messageText, senderId);
    setRoomId(roomId);
  });

  if (loading) {
    return <ChatRoomSkeleton />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="h-full w-full overflow-y-scroll">
      {sortedChatRooms.map((chatRoom) => (
        <ChatRoomCard
          key={chatRoom.id}
          chatRoom={chatRoom}
          isActive={chatRoom.id === currentChatRoom?.id}
          userId={userId}
        />
      ))}
    </div>
  );
};
