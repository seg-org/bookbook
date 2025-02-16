"use client";

import { FC, PropsWithChildren, useState } from "react";

import { readMessages } from "@/data/chat";
import { ChatMessage, ChatRoom } from "@/data/dto/chat.dto";
import { useGetMyChatRooms } from "@/hooks/useGetMyChatRooms";
import { ChatContext } from "./chatContext";

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chatRooms, setChatRooms, loading, error } = useGetMyChatRooms();
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const changeCurrentRoom = async (chatRoom: ChatRoom, userId: string) => {
    setChatRooms((prev) => {
      const idx = prev.findIndex((cr) => cr.id === chatRoom.id);
      const updated = [...prev];
      if (idx !== -1) {
        const lastRead = userId === chatRoom.userIds[0] ? "lastReadA" : "lastReadB";
        updated[idx] = {
          ...updated[idx],
          [lastRead]: new Date(),
        };
      }
      return updated;
    });

    setCurrentChatRoom(chatRoom);
    await readMessages(chatRoom.id, userId);
  };

  const updateChatRoomLastMessage = (messageId: string, roomId: string, message: string, senderId: string) => {
    setChatRooms((prev) => {
      const idx = prev.findIndex((cr) => cr.id === roomId);
      const updated = [...prev];
      const lastRead = senderId === updated[idx].userIds[0] ? "lastReadA" : "lastReadB";
      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          lastMessage: {
            id: messageId,
            senderId,
            roomId,
            message,
            createdAt: new Date(),
          },
          [lastRead]: new Date(),
        };
      }
      return updated;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        currentChatRoom,
        setCurrentChatRoom,
        chatRooms,
        setChatRooms,
        loading,
        error,
        messages,
        setMessages,
        changeCurrentRoom,
        updateChatRoomLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
