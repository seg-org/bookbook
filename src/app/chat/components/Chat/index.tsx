import { sendMessage } from "@/data/chat";
import { ChatRoom } from "@/data/dto/chat.dto";
import { useEffect, useState } from "react";

type ChatProps = {
  chatRoom?: ChatRoom;
};

function Chat({ chatRoom }: ChatProps) {
  const [message, setMessage] = useState("");
  useEffect(() => {}, []);

  if (!chatRoom)
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-600">
        <p className="text-xl">เริ่มแชทกัน</p>
      </div>
    );

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
        <p>{chatRoom.id}</p>
        <p>{chatRoom.postId}</p>
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
