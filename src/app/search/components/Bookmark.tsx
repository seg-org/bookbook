import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { usePostContext } from "@/context/postContext";

type BookmarkProps = {
  postId: string;
};

export const Bookmark = ({ postId }: BookmarkProps) => {
  const { changeBookmark, bookmarks } = usePostContext();
  const isBookmarked = bookmarks.some((bookmark) => bookmark.postId === postId);
  const [isMarked, setIsMarked] = useState(isBookmarked);

  const handleClick = async () => {
    setIsMarked((prev) => !prev);

    await changeBookmark(postId);
  };

  return (
    <div className="hover:cursor-pointer" onClick={handleClick}>
      {isMarked ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}
    </div>
  );
};
