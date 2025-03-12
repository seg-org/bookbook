import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useChatContext } from "@/context/chatContext";
import { ChatRoom } from "@/data/dto/chat.dto";

import ThreeDotDropdown from "./ThreedotMenu";

type ChatRoomCardProps = {
  chatRoom: ChatRoom;
  isActive: boolean;
  userId: string;
};

const cut = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

export const ChatRoomCard = ({ chatRoom, isActive, userId }: ChatRoomCardProps) => {
  const { changeCurrentRoom } = useChatContext();
  const [isMounted, setIsMounted] = useState(false);
  // const session = await getServerSession(authOptions);

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
        "flex h-[10%] w-full justify-between space-x-4 p-2 px-4 hover:cursor-pointer hover:bg-gray-200",
        isActive ? "bg-gray-200" : "bg-gray-50",
        chatRoom.userB.isAdmin ? "bg-gradient-to-r from-blue-500" : ""
      )}
      onClick={() => changeCurrentRoom(chatRoom, userId)}
      data-test-id="chat-room"
    >
      <div className="flex space-x-4">
        <div className="flex h-full items-center">
          <Image
            className="h-16 w-16 rounded-full object-cover"
            src={chatRoom.post.book.coverImageUrl}
            width={100}
            height={100}
            objectFit="cover"
            alt="Book Cover"
          />
          {chatRoom.userB.isAdmin && (
            <Image
              src="/images/adminCrown.png"
              alt="Illustration"
              width={20}
              height={20}
              className="absolute ml-6 rotate-45 pb-20"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p>{`${chatRoom.userB.firstName} ${chatRoom.userB.lastName}`}</p>

          <p className={clsx(haveUnreadMessages ? "font-bold text-black" : "text-gray-500")}>
            {chatRoom.lastMessage && cut(chatRoom.lastMessage.message, 30)}
          </p>
        </div>
      </div>
      <div className="justify-end self-center">
        {!chatRoom.userB.isAdmin && (
          <ThreeDotDropdown roomId={chatRoom.id} reporterId={chatRoom.userIds[0]}></ThreeDotDropdown>
        )}
      </div>
    </div>
  );
};
