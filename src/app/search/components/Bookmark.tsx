import { createBookmark } from "@/data/bookmark";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

type BookmarkProps = {
  postId: string;
};

export const Bookmark = ({ postId }: BookmarkProps) => {
  const [isMarked, setIsMarked] = useState(false);

  const handleClick = async () => {
    setIsMarked((prev) => !prev);

    await createBookmark(postId);
  };

  return (
    <div className="hover:cursor-pointer" onClick={handleClick}>
      {isMarked ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}
    </div>
  );
};
