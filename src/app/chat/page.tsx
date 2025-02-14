"use client";

import { ChatRoom } from "@/data/dto/chat.dto";
import { useGetMyChatRooms } from "@/hooks/useGetMyChatRooms";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Chat from "./components/Chat";
import StartChat from "./components/Chat/StartChat";
import ChatCard from "./components/ChatCard";

function ChatPage() {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  if (!isAuthenticated || !session?.user) {
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

  return (
    <>
      <div className="flex h-[calc(100vh-72px)] bg-red-100">
        <div className="h-full w-[35%] border-r border-gray-200 bg-yellow-100">
          {chatRooms.map((chatRoom) => (
            <ChatCard
              key={chatRoom.postId}
              chatRoom={chatRoom}
              isActive={chatRoom.id === currentChatRoom?.id}
              onClick={() => setCurrentChatRoom(chatRoom)}
            />
          ))}
        </div>
        <div className="h-full w-[65%]">
          {currentChatRoom ? <Chat chatRoom={currentChatRoom} user={session.user} /> : <StartChat />}
        </div>
      </div>
    </>
  );
}

export default ChatPage;
