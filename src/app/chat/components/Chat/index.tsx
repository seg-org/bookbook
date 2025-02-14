import { useEffect, useState } from "react";
import { ChatRoom } from "../../page";

type ChatProps = {
  chatRoom: ChatRoom;
};

function Chat({ chatRoom }: ChatProps) {
  const [message, setMessage] = useState("");
  useEffect(() => {}, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatRoomId: chatRoom.id,
          message,
        }),
      });

      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
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
        <button className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" onClick={sendMessage}>
          ส่ง
        </button>
      </div>
    </div>
  );
}

export default Chat;
