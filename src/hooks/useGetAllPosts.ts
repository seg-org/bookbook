import { useEffect, useState } from "react";

import { Post } from "@/data/dto/post.dto";
import { getAllPosts, GetPostsFilters } from "@/data/post";

export type PaginationInfo = {
  total: number;
  totalPages: number;
  page: number;
};

export const useGetAllPosts = (params: GetPostsFilters) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getAllPosts(params);
      if (res instanceof Error) {
        return setError(res);
      }

      setPosts(res.posts);
      setPagination({ ...res });
      setLoading(false);
    })();
  }, []);

  return { posts, pagination, loading, error };
};
