import clsx from "clsx";
import { useEffect, useState } from "react";
import { ChatRoom } from "../page";

type ChatCardProps = {
  chatRoom: ChatRoom;
  isActive: boolean;
  onClick: () => void;
};

function ChatCard({ chatRoom, isActive, onClick }: ChatCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[10%] w-full bg-gray-50 p-4">
        <p>{chatRoom.subject}</p>
        <p>{chatRoom.subjectId}</p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "h-[10%] w-full p-4 hover:cursor-pointer hover:bg-gray-200",
        isActive ? "bg-gray-200" : "bg-gray-50"
      )}
      onClick={() => onClick()}
    >
      <p>{chatRoom.subject}</p>
      <p>{chatRoom.subjectId}</p>
    </div>
  );
}

export default ChatCard;
