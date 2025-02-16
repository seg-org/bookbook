import { useChatContext } from "@/context/chatContext";
import { useChannel } from "ably/react";
import { useMemo, useState } from "react";
import { ChatRoomCard } from "./ChatRoomCard";

type ChatRoomListProps = {
  userId: string;
};

export const ChatRoomList = ({ userId }: ChatRoomListProps) => {
  const { currentChatRoom, chatRooms, setChatRooms, loading, error } = useChatContext();
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
    const roomId: string = message.data.roomId;
    const messageText: string = message.data.message;
    const senderId: string = message.data.senderId;
    setChatRooms((prev) => {
      const idx = prev.findIndex((cr) => cr.id === roomId);
      const updated = [...prev];
      const lastRead = senderId === updated[idx].userIds[0] ? "lastReadA" : "lastReadB";
      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          lastMessage: {
            id: message.id as string,
            senderId: message.data.senderId,
            roomId: roomId,
            message: messageText,
            createdAt: new Date(),
          },
          [lastRead]: new Date(),
        };
      }
      return updated;
    });
    setRoomId(roomId);
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      {sortedChatRooms.map((chatRoom) => (
        <ChatRoomCard
          key={chatRoom.id}
          chatRoom={chatRoom}
          isActive={chatRoom.id === currentChatRoom?.id}
          userId={userId}
        />
      ))}
    </>
  );
};
