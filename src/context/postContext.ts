import { Bookmark } from "@/data/dto/bookmark.dto";
import { Post } from "@/data/dto/post.dto";
import { createContext, useContext } from "react";

export interface PostWithBookmark extends Post {
  isBookmarked: boolean;
}
interface PostContext {
  posts: PostWithBookmark[];
  recommendedPosts: PostWithBookmark[];
  bookmarks: Bookmark[];
  loading: boolean;
  error: Error | null;
  changeBookmark: (postId: string) => Promise<void>;
}

export const PostContext = createContext<PostContext>({
  posts: [],
  recommendedPosts: [],
  bookmarks: [],
  loading: false,
  error: null,
  changeBookmark: () => Promise.resolve(),
});

export const usePostContext = () => {
  return useContext(PostContext);
};
