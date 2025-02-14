import clsx from "clsx";

type MessageBubbleProps = {
  message: string;
  isSent: boolean;
};

export const MessageBubble = ({ message, isSent }: MessageBubbleProps) => {
  return (
    <div className={clsx("flex items-end", isSent ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "relative max-w-[75%] rounded-lg p-3 text-white shadow-md",
          isSent ? "bg-blue-500" : "bg-gray-300 text-black",
          isSent ? "rounded-br-none" : "rounded-bl-none"
        )}
      >
        {message}
        <div
          className={clsx(
            "absolute h-3 w-3 rotate-45",
            isSent ? "-bottom-1 right-0 bg-blue-500" : "-bottom-1 left-0 bg-gray-300"
          )}
        />
      </div>
    </div>
  );
};
