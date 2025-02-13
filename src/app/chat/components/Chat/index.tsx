import { ChatRoom } from "../../page";

type ChatProps = {
  chatRoom: ChatRoom;
};

function Chat({ chatRoom }: ChatProps) {
  return (
    <div className="h-full w-full bg-gray-50">
      <div className="h-[80%] border-b p-4">
        <p>{chatRoom.subject}</p>
        <p>{chatRoom.subjectId}</p>
      </div>
      <div className="h-[20%] p-4">type something here...</div>
    </div>
  );
}

export default Chat;
