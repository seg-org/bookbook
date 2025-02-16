import { createBookmark } from "@/data/bookmark";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

type BookmarkProps = {
  postId: string;
  initialState: boolean;
};

export const Bookmark = ({ postId, initialState }: BookmarkProps) => {
  const [isMarked, setIsMarked] = useState(initialState);

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
