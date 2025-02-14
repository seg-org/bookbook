"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Chat from "./components/Chat";
import ChatCard from "./components/ChatCard";

export type ChatRoom = {
  id: string;
  subject: "post" | "report";
  subjectId: string;
};

function ChatPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    redirect("/login");
  }

  const chatRooms: ChatRoom[] = [
    {
      id: "1",
      subject: "post",
      subjectId: "1",
    },
    {
      id: "2",
      subject: "report",
      subjectId: "2",
    },
  ];

  const [currentChatRoom, setCurrentChatRoom] = useState(chatRooms[0]);

  return (
    <>
      <div className="flex h-[calc(100vh-72px)] bg-red-100">
        <div className="h-full w-[35%] border-r border-gray-200 bg-yellow-100">
          {chatRooms.map((chatRoom) => (
            <ChatCard
              key={chatRoom.subjectId}
              chatRoom={chatRoom}
              isActive={chatRoom.id === currentChatRoom.id}
              onClick={() => setCurrentChatRoom(chatRoom)}
            />
          ))}
        </div>
        <div className="h-full w-[65%] bg-orange-100">
          <Chat chatRoom={currentChatRoom} />
        </div>
      </div>
    </>
  );
}

export default ChatPage;
