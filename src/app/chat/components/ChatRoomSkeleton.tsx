export const ChatRoomSkeleton = () => {
  const list = Array.from({ length: 15 }, (_, i) => i);
  return (
    <div className="h-full w-full overflow-y-scroll">
      {list.map((i) => (
        <div className="flex h-[10%] w-full space-x-4 bg-gray-50 p-2 px-4" key={i}>
          <div className="flex h-full items-center">
            <div className="animate-glow h-16 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="animate-glow mb-2 h-4 w-24 bg-gray-200" />

            <p className="animate-glow h-4 w-48 bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
