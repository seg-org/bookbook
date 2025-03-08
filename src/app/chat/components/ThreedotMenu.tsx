import Link from "next/link";
import { useState } from "react";

type ReportChatRoomProps = {
  roomId: string;
  reporterId: string;
};

export default function ThreeDotDropdown({ roomId, reporterId }: ReportChatRoomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = { roomId, reporterId };
  return (
    <div className="relative inline-block">
      {/* Three-dot Button */}
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="rounded-md px-2 py-1 text-2xl hover:bg-gray-300"
      >
        ⋮
      </button>

      {isOpen && (
        <div
          className="absolute right-0 w-48 rounded-lg border border-gray-300 bg-white shadow-lg"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="py-2">
            <Link
              href={{
                pathname: "/chatReport",
                query: data,
              }}
            >
              <li className="cursor-pointer px-4 hover:bg-gray-100">รายงานผู้ใช้</li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}
