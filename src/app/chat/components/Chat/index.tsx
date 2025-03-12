import { useChannel } from "ably/react";
import { useEffect, useRef, useState } from "react";

import { sendMessage } from "@/data/chat";
import { ChatMessage, ChatRoom } from "@/data/dto/chat.dto";
import { useGetChatMessages } from "@/hooks/useGetChatMessages";
import { SessionUser } from "@/lib/auth";

import clsx from "clsx";
import { MessageBubble } from "./MessageBubble";

import "./rainbow.css";

type ChatProps = {
  chatRoom: ChatRoom;
  user: SessionUser;
};

function Chat({ chatRoom, user }: ChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageEnd = useRef<HTMLDivElement>(null);
  const initialMessages = useGetChatMessages(chatRoom.id);
  const { channel } = useChannel("chat", (message) => {
    if (message.data.roomId !== chatRoom.id) return;

    const newMessage: ChatMessage = {
      id: message.id as string,
      senderId: message.data.senderId,
      message: message.data.message,
      roomId: chatRoom.id,
      createdAt: new Date(),
    };

    const history = messages.slice(-199);
    setMessages([...history, newMessage]);

    setTimeout(() => {
      messageEnd.current?.scrollIntoView({ behavior: "instant" });
    }, 100);
  });

  useEffect(() => {
    setMessages(initialMessages.chatMessages);
    const timeout = setTimeout(() => {
      messageEnd.current?.scrollIntoView({ behavior: "instant" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [chatRoom.id, initialMessages.chatMessages]);

  const handleSendMessage = async () => {
    const text = message.trim();
    setMessage("");
    if (!text) return;
    channel.publish("message", { senderId: user.id, roomId: chatRoom.id, message });

    const messageRes = await sendMessage(chatRoom.id, text);
    if (messageRes instanceof Error) {
      console.error("Failed to send message:", messageRes);
      return;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getUsername = (userId: string) => {
    if (userId === user.id) {
      return "คุณ";
    } else {
      return `${chatRoom.userB.firstName} ${chatRoom.userB.lastName}`;
    }
  };

  const rainbow = messages.filter((m) => m.message.includes("rainbow")).length % 2 === 1;

  return (
    <div className="h-full w-full bg-gray-50">
      <div className={clsx("h-[90%] overflow-scroll border-b p-4", rainbow && "rainbow-container")}>
        {messages.map((m, idx) => (
          <MessageBubble
            key={idx}
            isMine={m.senderId === user.id}
            username={getUsername(m.senderId as string)}
            message={m.message}
            isAdminMessage={m.senderId === chatRoom.userB.id && chatRoom.userB.isAdmin}
            isSent
          />
        ))}
        <div ref={messageEnd} />
      </div>
      <div className="flex h-[10%] items-center border-t p-4">
        <input
          type="text"
          className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="พิมพ์ข้อความ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          data-test-id="chat-input"
        />
        <button
          className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleSendMessage}
          data-test-id="chat-send-message"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}

export default Chat;
