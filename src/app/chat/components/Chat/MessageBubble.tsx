import clsx from "clsx";

type MessageBubbleProps = {
  username: string;
  message: string;
  isMine: boolean;
  isSent: boolean;
};

export const MessageBubble = ({ username, message, isMine }: MessageBubbleProps) => {
  return (
    <div className={clsx("mb-2 flex flex-col bg-red-100", isMine ? "items-end" : "items-start")}>
      <div className={clsx("flex flex-col", isMine ? "items-end" : "items-start")}>
        <p className="text-sm">{username}</p>
        <div
          className={clsx(
            "relative max-w-[75%] rounded-lg p-3 shadow-md",
            isMine ? "rounded-br-none bg-blue-500 pr-8 text-white" : "rounded-bl-none bg-gray-300 text-black"
          )}
        >
          {message}
          <div
            className={clsx("absolute h-4 w-4 bg-inherit", isMine ? "-bottom-1.5 right-0" : "-bottom-1.5 left-0")}
            style={{
              clipPath: isMine
                ? "polygon(100% 100%, 0 0, 100% 0)" // Tail pointing right
                : "polygon(0 100%, 100% 0, 0 0)", // Tail pointing left
            }}
          />
        </div>
      </div>
    </div>
  );
};
