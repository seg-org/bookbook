"use client";

import { FC, PropsWithChildren } from "react";

import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import { useGetRecommendedPost } from "@/hooks/useGetRecommendedPost";
import { useSession } from "next-auth/react";
import { PostContext } from "./postContext";

export const PostProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession();

  const { posts, loading: loadingAll, error: errorAll } = useGetAllPosts();
  const {
    posts: recommendedPosts,
    loading: loadingRecommended,
    error: errorRecommended,
  } = useGetRecommendedPost(session?.user.id);

  const loading = loadingAll || loadingRecommended;
  const error = errorAll || errorRecommended;

  return (
    <PostContext.Provider
      value={{
        posts,
        recommendedPosts,
        loading,
        error,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
