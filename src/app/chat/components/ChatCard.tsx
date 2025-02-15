import { ChatRoom } from "@/data/dto/chat.dto";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

type ChatCardProps = {
  chatRoom: ChatRoom;
  isActive: boolean;
  onClick: () => void;
};

const cut = (s: string, n: number) => {
  if (s.length > n) {
    return s.slice(0, n) + "...";
  }
  return s;
};

function ChatCard({ chatRoom, isActive, onClick }: ChatCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[10%] w-full bg-gray-50 p-4"></div>;
  }

  return (
    <div
      className={clsx(
        "flex h-[10%] w-full space-x-4 p-2 px-4 hover:cursor-pointer hover:bg-gray-200",
        isActive ? "bg-gray-200" : "bg-gray-50"
      )}
      onClick={() => onClick()}
    >
      <div className="flex h-full items-center">
        <Image
          className="h-16 w-16 rounded-full object-cover"
          src={chatRoom.post.book.coverImageUrl}
          width={100}
          height={100}
          objectFit="cover"
          alt="Book Cover"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p>{`${chatRoom.userB.firstName} ${chatRoom.userB.lastName}`}</p>
        <p>{chatRoom.lastMessage && cut(chatRoom.lastMessage.message, 40)}</p>
      </div>
    </div>
  );
}

export default ChatCard;
