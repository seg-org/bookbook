import { useChatContext } from "@/context/chatContext";
import { ChatRoom } from "@/data/dto/chat.dto";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

type ChatRoomCardProps = {
  chatRoom: ChatRoom;
  isActive: boolean;
  userId: string;
};

const cut = (s: string, n: number) => {
  if (s.length > n) {
    return s.slice(0, n) + "...";
  }
  return s;
};

export const ChatRoomCard = ({ chatRoom, isActive, userId }: ChatRoomCardProps) => {
  const { changeCurrentRoom } = useChatContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[10%] w-full bg-gray-50 p-4"></div>;
  }

  const lastRead = userId === chatRoom.userIds[0] ? "lastReadA" : "lastReadB";
  const haveUnreadMessages = chatRoom.lastMessage ? chatRoom.lastMessage.createdAt > chatRoom[lastRead] : false;

  return (
    <div
      className={clsx(
        "flex h-[10%] w-full space-x-4 p-2 px-4 hover:cursor-pointer hover:bg-gray-200",
        isActive ? "bg-gray-200" : "bg-gray-50"
      )}
      onClick={() => changeCurrentRoom(chatRoom, userId)}
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
        <p className={clsx(haveUnreadMessages ? "font-bold text-black" : "text-gray-500")}>
          {chatRoom.lastMessage && cut(chatRoom.lastMessage.message, 40)}
        </p>
      </div>
    </div>
  );
};
