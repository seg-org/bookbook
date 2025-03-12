"use client";

import { useMemo } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { Button } from "@/components/ui/Button";
import { usePostContext } from "@/context/postContext";

export default function BookmarkAction({ postId }: { postId: string }) {
  const { bookmarks, changeBookmark } = usePostContext();

  const isBookmarked = useMemo(() => bookmarks.some((bookmark) => bookmark.postId === postId), [bookmarks, postId]);

  return (
    <Button
      className="flex w-40 items-center justify-center gap-2 transition-colors"
      onClick={() => changeBookmark(postId)}
    >
      {isBookmarked ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}

      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
