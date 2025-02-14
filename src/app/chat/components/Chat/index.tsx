import { sendMessage } from "@/data/chat";
import { useEffect, useState } from "react";
import { ChatRoom } from "../../page";

type ChatProps = {
  chatRoom: ChatRoom;
};

function Chat({ chatRoom }: ChatProps) {
  const [message, setMessage] = useState("");
  useEffect(() => {}, []);

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

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="h-[90%] border-b p-4">
        <p>{chatRoom.subject}</p>
        <p>{chatRoom.subjectId}</p>
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
