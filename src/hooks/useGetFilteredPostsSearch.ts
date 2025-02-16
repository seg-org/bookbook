import { Post } from "@/data/dto/post.dto";
import { PostFilterCondition } from "@/data/dto/postFilterCondition";
import { getFilteredPosts } from "@/data/filtered-post";
import { useEffect, useState } from "react";

export const useFilteredPosts = (condition : PostFilterCondition) => {
  console.log(condition);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getFilteredPosts(condition);
      if (res instanceof Error) {
        return setError(res);
      }

      setPosts(res);
      setLoading(false);
    })();
  }, []);

  return { posts, loading, error };
};
