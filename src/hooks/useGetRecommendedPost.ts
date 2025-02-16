import { Post } from "@/data/dto/post.dto";
import { getRecommendedPosts } from "@/data/post";
import { useEffect, useState } from "react";

export const useGetRecommendedPost = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      let posts: Post[] | Error = [];
      if (userId) {
        posts = await getRecommendedPosts(userId);
      }

      if (posts instanceof Error) {
        return setError(posts);
      }

      setPosts(posts);
      setLoading(false);
    })();
  }, [userId]);

  return { posts, loading, error };
};
