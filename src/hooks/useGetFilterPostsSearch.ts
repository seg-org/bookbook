import { Post } from "@/data/dto/post.dto";
import { getAllPosts } from "@/data/post";
import { useEffect, useState } from "react";

export const useFilteredPosts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getAllPosts();
      if (res instanceof Error) {
        return setError(res);
      }

      setPosts(res);
      setLoading(false);
    })();
  }, []);

  return { posts, loading, error };
};
