import { Post } from "@/data/dto/post.dto";
import { getPost } from "@/data/post";
import { useEffect, useState } from "react";

export const useGetPost = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post>();

  useEffect(() => {
    (async () => {
      const res = await getPost(id);
      if (res instanceof Error) {
        return setError(res);
      }

      setPosts(res);
      setLoading(false);
    })();
  }, [id]);

  return { posts, loading, error };
};
