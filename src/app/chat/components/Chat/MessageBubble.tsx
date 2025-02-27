import clsx from "clsx";

type MessageBubbleProps = {
  username: string;
  message: string;
  isMine: boolean;
  isSent: boolean;
};

export const MessageBubble = ({ username, message, isMine }: MessageBubbleProps) => {
  return (
    <div className={clsx("mb-2 flex flex-col overflow-clip", isMine ? "items-end" : "items-start")}>
      <div className={clsx("flex w-full flex-col", isMine ? "items-end" : "items-start")}>
        <p className="text-sm">{username}</p>
        <div
          className={clsx(
            "relative max-w-[75%] text-wrap rounded-lg p-3 shadow-md",
            isMine ? "rounded-br-none bg-blue-500 text-white" : "rounded-bl-none bg-gray-300 text-black",
            message.length > 100 && "break-words"
          )}
          data-test-id="chat-message"
        >
          {message}
        </div>
      </div>
    </div>
  );
};
