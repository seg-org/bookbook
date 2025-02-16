import { usePostContext } from "@/context/postContext";
import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

type BookmarkProps = {
  postId: string;
  initialState: boolean;
};

export const Bookmark = ({ postId, initialState }: BookmarkProps) => {
  const [isMarked, setIsMarked] = useState(initialState);
  const { changeBookmark } = usePostContext();

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
