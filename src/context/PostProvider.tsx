"use client";

import { produce } from "immer";
import { useSession } from "next-auth/react";
import { FC, PropsWithChildren, useMemo, useState } from "react";

import { toggleBookmark } from "@/data/bookmark";
import { Bookmark } from "@/data/dto/bookmark.dto";
import { Post } from "@/data/dto/post.dto";
import { GetPostsFilters } from "@/data/post";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import { useGetMyBookmarks } from "@/hooks/useGetMyBookmarks";
import { useGetRecommendedPost } from "@/hooks/useGetRecommendedPost";

import { PostContext } from "./postContext";

export const PostProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession();
  const [postsFilters, setPostsFilters] = useState<GetPostsFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt", // default to sort by most recent
    sortOrder: "desc",
  });

  const { posts, pagination, loading: loadingAll, error: errorAll } = useGetAllPosts(postsFilters);
  const {
    posts: recommendedPosts,
    loading: loadingRecommended,
    error: errorRecommended,
  } = useGetRecommendedPost(session?.user.id);
  const { bookmarks, setBookmarks, loading: loadingBookmark, error: errorBookmark } = useGetMyBookmarks();

  const changeBookmark = async (postId: string) => {
    setBookmarks(
      produce((draft) => {
        const idx = draft.findIndex((b) => b.postId === postId);
        if (idx !== -1) {
          draft.splice(idx, 1);
        } else {
          draft.push({ postId, userId: session?.user.id ?? "" });
        }
      }),
    );
    await toggleBookmark(postId);
  };

  const postsWithBookmarks = useMemo(() => matchBookmarksToPosts(posts, bookmarks), [posts, bookmarks]);
  const recommendedPostsWithBookmarks = useMemo(
    () => matchBookmarksToPosts(recommendedPosts, bookmarks),
    [recommendedPosts, bookmarks],
  );

  const loading = loadingAll || loadingRecommended || loadingBookmark;
  const error = errorAll || errorRecommended || errorBookmark;

  return (
    <PostContext.Provider
      value={{
        posts: postsWithBookmarks,
        pagination,
        recommendedPosts: recommendedPostsWithBookmarks,
        bookmarks,
        loading,
        error,
        changeBookmark,
        setPostsFilters,
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
