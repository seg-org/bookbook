import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Post } from "@/data/dto/post.dto";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import { useState } from "react";
import PostCard from "./PostCard";
import RecommendPostCard from "./RecommendPostCard";
export const PostList = ({ inputSearchValue }: { inputSearchValue: string }) => {
  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);

  // const { recommend_post, recommend_post_loading, recommend_post_error } = useGetRecommendPost("dfdgfh");
  // if (recommend_post_loading) {
  //   return <div>Loading...</div>;
  // }
  // if (recommend_post_error) {
  //   return <div>Failed to get posts</div>;
  // }

  const { posts, loading, error } = useGetAllPosts();
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  const filter_posts = posts.filter((post) => post.book.title.toLowerCase().includes(inputSearchValue.toLowerCase()));

  filter_posts.sort(function (a, b) {
    return priceAsc * (a.price - b.price);
  });

  return (
    <>
      <div className="item-center flex flex-col pt-8">
        <div className="flex flex-row gap-5 self-start">
          <div className="ml-3.5 mr-auto mt-1 text-lg">เรียงโดย</div>
          <button
            onClick={() => setPriceAsc(-1 * priceAsc)}
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
          >
            ราคา <span className="ml-2">{priceAsc == 1 ? "▲" : "▼"}</span>
          </button>
          <button
            onClick={() => setPopAsc(-1 * popAsc)}
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
          >
            ความนิยม <span className="ml-2">{popAsc == 1 ? "▲" : "▼"}</span>
          </button>
        </div>
        <div className="m-2 ml-1.5 flex w-full flex-wrap gap-5 p-2 pt-8 text-lg">
          {filter_posts.map((post: Post, idx: number) =>
            idx < 3 ? <RecommendPostCard post={post} key={post.id} /> : <PostCard post={post} key={post.id} />
          )}
          {/* {filter_posts.map((post: Post) => (
            <PostCard post={post} key={post.id} />
          ))} */}
        </div>
      </div>
    </>
  );
};
