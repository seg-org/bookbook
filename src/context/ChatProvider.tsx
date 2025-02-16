"use client";

import { FC, PropsWithChildren, useState } from "react";

import { ChatRoom } from "@/data/dto/chat.dto";
import { ChatContext } from "./chatContext";

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);

  return (
    <ChatContext.Provider
      value={{
        currentChatRoom,
        setCurrentChatRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
