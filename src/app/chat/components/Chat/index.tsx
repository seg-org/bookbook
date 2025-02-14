import { sendMessage } from "@/data/chat";
import { ChatRoom } from "@/data/dto/chat.dto";
import { useGetChatMessages } from "@/hooks/useGetChatMessages";
import { SessionUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { MessageBubble } from "./MessageBubble";

type ChatProps = {
  chatRoom: ChatRoom;
  user: SessionUser;
};

function Chat({ chatRoom, user }: ChatProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {}, []);

  const messages = useGetChatMessages(chatRoom.id);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const messageRes = await sendMessage(chatRoom.id, message);
    if (messageRes instanceof Error) {
      console.error("Failed to send message:", messageRes);
      return;
    }

    setMessage("");
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

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="h-[90%] border-b p-4">
        {messages.chatMessages.map((m) => (
          <MessageBubble
            key={m.id}
            isMine={m.senderId === user.id}
            username={getUsername(m.senderId)}
            message={m.message}
            isSent
          />
        ))}
      </div>
      <div className="flex h-[10%] items-center border-t p-4">
        <input
          type="text"
          className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="พิมพ์ข้อความ..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleSendMessage}
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}

export default Chat;
