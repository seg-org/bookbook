import { getMyBookmarks } from "@/data/bookmark";
import { Bookmark } from "@/data/dto/bookmark.dto";
import { useEffect, useState } from "react";

export const useGetMyBookmarks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getMyBookmarks();
      if (res instanceof Error) {
        return setError(res);
      }

      setBookmarks(res);
      setLoading(false);
    })();
  }, []);

  return { bookmarks, setBookmarks, loading, error };
};
