"use client";

interface Props {
  text: string;
}

const LineSeparator = ({ text }: Props) => {
  return (
    <div className="5xl:col-span_5 col-span-1 flex items-center lg:col-span-2 xl:col-span-3 3xl:col-span-4">
      <span className="left-0 z-10 bg-transparent px-4 text-gray-400">{text}</span>
      <div className="flex-grow overflow-hidden border-t border-gray-400"></div>
    </div>
  );
};

export default LineSeparator;
