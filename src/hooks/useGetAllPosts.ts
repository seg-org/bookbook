import { useEffect, useState } from "react";

import { Post } from "@/data/dto/post.dto";
import { getAllPosts, getMyPosts, GetPostsFilters } from "@/data/post";

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
  }, [params]);

  return { posts, pagination, loading, error };
};


export const useGetMyPost = (params: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  if(params.sortBy === "popularity"){
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
