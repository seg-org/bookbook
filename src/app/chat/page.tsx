"use client";

import Chat from "./components/Chat";
import ChatCard from "./components/ChatCard";

export type ChatRoom = {
  subject: "post" | "report";
  subjectId: string;
};

function ChatPage() {
  const chatRooms: ChatRoom[] = [
    {
      subject: "post",
      subjectId: "1",
    },
    {
      subject: "report",
      subjectId: "2",
    },
  ];
  return (
    <>
      <div className="flex h-[calc(100vh-72px)] bg-red-100">
        <div className="h-full w-[35%] border-r border-gray-200 bg-yellow-100">
          {chatRooms.map((chatRoom) => (
            <ChatCard key={chatRoom.subjectId} chatRoom={chatRoom} />
          ))}
        </div>
        <div className="h-full w-[65%] bg-orange-100">
          <Chat chatRoom={chatRooms[0]} />
        </div>
      </div>
    </>
  );
}

export default ChatPage;
