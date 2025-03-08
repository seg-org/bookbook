export const ChatRoomSkeleton = () => {
  const list = Array.from({ length: 15 }, (_, i) => i);
  return (
    <div className="h-full w-full overflow-y-scroll">
      {list.map((i) => (
        <div className="flex h-[10%] w-full space-x-4 bg-gray-50 p-2 px-4" key={i}>
          <div className="flex h-full items-center">
            <div className="h-16 w-16 animate-glow rounded-full bg-gray-200" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-2 h-4 w-24 animate-glow bg-gray-200" />

            <p className="h-4 w-48 animate-glow bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
