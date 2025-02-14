import { Post } from "@/data/dto/post.dto";
import { getRecommendPosts } from "@/data/recommend-post";
import { useEffect, useState } from "react";

export const useGetRecommendPost = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getRecommendPosts(userId);
      if (res instanceof Error) {
        return setError(res);
      }

      setPosts(res);
      setLoading(false);
    })();
  }, [userId]);

  return { posts, loading, error };
};
