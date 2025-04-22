import { format } from "date-fns";

type ChatCardProps = {
  msg: {
    id: string;
    senderId: string;
    message: string;
    createdAt: Date;
  };
  left: string | undefined;
};

const ChatCard = ({ msg, left }: ChatCardProps) => {
  const isLeft = msg.senderId === left;

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-xs rounded-xl px-4 py-2 text-sm shadow-md ${
          isLeft ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"
        }`}
      >
        <p className="mb-1 text-xs font-semibold">{msg.senderId}</p>
        <p className="whitespace-pre-wrap">{msg.message}</p>
        <p className="mt-1 text-right text-[10px] text-gray-500">{format(new Date(msg.createdAt), "p")}</p>
      </div>
    </div>
  );
};

export default ChatCard;
