import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { Bookmark } from "@/data/dto/bookmark.dto";
import { Post } from "@/data/dto/post.dto";
import { GetPostsFilters } from "@/data/post";
import { PaginationInfo } from "@/hooks/useGetAllPosts";

export interface PostWithBookmark extends Post {
  isBookmarked: boolean;
}
interface PostContext {
  posts: PostWithBookmark[];
  pagination: PaginationInfo | null;
  recommendedPosts: PostWithBookmark[];
  bookmarks: Bookmark[];
  loading: boolean;
  error: Error | null;
  changeBookmark: (postId: string) => Promise<void>;
  setPostsFilters: Dispatch<SetStateAction<GetPostsFilters>>;
}

export const PostContext = createContext<PostContext>({
  posts: [],
  pagination: null,
  recommendedPosts: [],
  bookmarks: [],
  loading: false,
  error: null,
  changeBookmark: () => Promise.resolve(),
  setPostsFilters: () => {},
});

export const usePostContext = () => {
  return useContext(PostContext);
};
