"use client";

import { FC, PropsWithChildren } from "react";

import { Bookmark } from "@/data/dto/bookmark.dto";
import { Post } from "@/data/dto/post.dto";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import { useGetMyBookmarks } from "@/hooks/useGetMyBookmarks";
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
  const { bookmarks, loading: loadingBookmark, error: errorBookmark } = useGetMyBookmarks();

  const postsWithBookmarks = matchBookmarksToPosts(posts, bookmarks);
  const recommendedPostsWithBookmarks = matchBookmarksToPosts(recommendedPosts, bookmarks);

  const loading = loadingAll || loadingRecommended || loadingBookmark;
  const error = errorAll || errorRecommended || errorBookmark;

  return (
    <PostContext.Provider
      value={{
        posts: postsWithBookmarks,
        recommendedPosts: recommendedPostsWithBookmarks,
        bookmarks,
        loading,
        error,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

const matchBookmarksToPosts = (posts: Post[], bookmarks: Bookmark[]): (Post & { isBookmarked: boolean })[] => {
  const bookmarkedPostIds = new Set(bookmarks.map((b) => b.postId));

  return posts.map((post) => ({
    ...post,
    isBookmarked: bookmarkedPostIds.has(post.id),
  }));
};
