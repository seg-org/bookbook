import { useCallback, useEffect, useState } from "react";

import { Post } from "@/data/dto/post.dto";
import { getAllPosts, getMyPosts, GetPostsFilters } from "@/data/post";

export type PaginationInfo = {
  total: number;
  totalPages: number;
  page: number;
};

export type MypostParam = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  author: string;
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

export const useGetMyPost = (params: MypostParam) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  if (params.sortBy === "popularity") {
    params.sortBy = "createdAt";
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getMyPosts(params);
      if (res instanceof Error) {
        setLoading(false);
        return setError(res);
      }
      setTotalPages(res.totalPages);
      setPosts(res.posts);
      setPagination({ ...res });
      setLoading(false);
    })();
  }, [params]);

  return { posts, totalPages, pagination, loading, error };
};
