import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

export const Bookmark = () => {
  const [isMarked, setIsMarked] = useState(false);

  const handleClick = () => {
    setIsMarked((prev) => !prev);
  };

  return (
    <div className="hover:cursor-pointer" onClick={handleClick}>
      {isMarked ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}
    </div>
  );
};
