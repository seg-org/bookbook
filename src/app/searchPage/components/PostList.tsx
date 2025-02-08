import { Post } from "@/data/dto/post.dto";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import PostCard from "./PostCard";

export const PostList = () => {
  const { posts, loading, error } = useGetAllPosts();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  return (
    <div className="grid-cols-auto-fit-400 grid w-full gap-8 p-8 text-lg">
      {posts.map((post: Post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
};
