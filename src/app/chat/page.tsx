"use client";

import { useChatContext } from "@/context/chatContext";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Chat from "./components/Chat";
import StartChat from "./components/Chat/StartChat";
import { ChatRoomList } from "./components/ChatRoomList";

function ChatPage() {
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  if (status !== "loading" && (!isAuthenticated || !session?.user)) {
    redirect("/login");
  }

  const { currentChatRoom } = useChatContext();

  const client = new Ably.Realtime({ authUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/socket` });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat">
        <div className="flex h-[calc(100vh-72px)]">
          <div className="h-full w-[35%] border-r border-gray-200 bg-gray-50">
            <ChatRoomList userId={session?.user.id ?? ""} />
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
