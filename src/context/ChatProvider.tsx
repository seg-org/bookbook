"use client";

import { produce } from "immer";
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
    setChatRooms(
      produce((draft) => {
        const idx = draft.findIndex((cr) => cr.id === chatRoom.id);
        if (idx !== -1) {
          const lastRead = userId === chatRoom.userIds[0] ? "lastReadA" : "lastReadB";
          draft[idx] = {
            ...draft[idx],
            [lastRead]: new Date(),
          };
        }
      })
    );

    setCurrentChatRoom(chatRoom);
    await readMessages(chatRoom.id, userId);
  };

  const updateChatRoomLastMessage = (messageId: string, roomId: string, message: string, senderId: string) => {
    setChatRooms(
      produce((draft) => {
        const idx = draft.findIndex((cr) => cr.id === roomId);
        const lastRead = senderId === draft[idx].userIds[0] ? "lastReadA" : "lastReadB";
        draft[idx] = {
          ...draft[idx],
          lastMessage: {
            id: messageId,
            senderId,
            roomId,
            message,
            createdAt: new Date(),
          },
          [lastRead]: new Date(),
        };
      })
    );
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
