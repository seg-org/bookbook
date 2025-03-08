import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { getMyBookmarks } from "@/data/bookmark";
import { Bookmark } from "@/data/dto/bookmark.dto";

export const useGetMyBookmarks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    (async () => {
      if (!isAuthenticated || !session?.user) {
        setLoading(false);
        setBookmarks([]);
        return;
      }

      const res = await getMyBookmarks();
      if (res instanceof Error) {
        return setError(res);
      }

      setBookmarks(res);
      setLoading(false);
    })();
  }, [isAuthenticated, session]);

  return { bookmarks, setBookmarks, loading, error };
};
