"use client";

import { FC, PropsWithChildren, useState } from "react";

import { ChatMessage, ChatRoom } from "@/data/dto/chat.dto";
import { useGetMyChatRooms } from "@/hooks/useGetMyChatRooms";
import { ChatContext } from "./chatContext";

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chatRooms, setChatRooms, loading, error } = useGetMyChatRooms();
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
