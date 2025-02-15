"use client";

import { ChatRoom } from "@/data/dto/chat.dto";
import { useGetMyChatRooms } from "@/hooks/useGetMyChatRooms";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Chat from "./components/Chat";
import StartChat from "./components/Chat/StartChat";
import ChatCard from "./components/ChatCard";

function ChatPage() {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  if (status !== "loading" && (!isAuthenticated || !session?.user)) {
    redirect("/login");
  }

  const { chatRooms, loading, error } = useGetMyChatRooms();

  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | undefined>(chatRooms[0]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const client = new Ably.Realtime({ authUrl: "/api/chat/socket" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat">
        <div className="flex h-[calc(100vh-72px)] bg-red-100">
          <div className="h-full w-[35%] border-r border-gray-200 bg-yellow-100">
            {chatRooms.map((chatRoom) => (
              <ChatCard
                key={chatRoom.id}
                chatRoom={chatRoom}
                isActive={chatRoom.id === currentChatRoom?.id}
                onClick={() => setCurrentChatRoom(chatRoom)}
              />
            ))}
          </div>
          <div className="h-full w-[65%]">
            {currentChatRoom ? <Chat chatRoom={currentChatRoom} user={session!.user} /> : <StartChat />}
          </div>
        </div>
      </ChannelProvider>
    </AblyProvider>
  );
}

export default ChatPage;
