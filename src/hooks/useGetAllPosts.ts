import { useCallback, useEffect, useState } from "react";

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

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAllPosts(params);
    if (res instanceof Error) {
      setError(res);
      setLoading(false);
      return;
    }

    setPosts(res.posts);
    setPagination({ ...res });
    setLoading(false);
  }, [params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, pagination, loading, error, refetch: fetchPosts };
};
