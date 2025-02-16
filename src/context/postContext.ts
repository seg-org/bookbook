import { Bookmark } from "@/data/dto/bookmark.dto";
import { Post } from "@/data/dto/post.dto";
import { createContext, useContext } from "react";

interface PostContext {
  posts: Post[];
  recommendedPosts: Post[];
  bookmarks: Bookmark[];
  loading: boolean;
  error: Error | null;
}

export const PostContext = createContext<PostContext>({
  posts: [],
  recommendedPosts: [],
  bookmarks: [],
  loading: false,
  error: null,
});

export const usePostContext = () => {
  return useContext(PostContext);
};
