import { ChatRoom } from "../page";

type ChatCardProps = {
  chatRoom: ChatRoom;
};

function ChatCard({ chatRoom }: ChatCardProps) {
  return (
    <div className="h-[10%] w-full bg-gray-50 p-4">
      <p>{chatRoom.subject}</p>
      <p>{chatRoom.subjectId}</p>
    </div>
  );
}

export default ChatCard;
