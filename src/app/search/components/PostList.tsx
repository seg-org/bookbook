import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Post } from "@/data/dto/post.dto";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import { useGetRecommendPost } from "@/hooks/useGetRecommendPost";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PostCard from "./PostCard";
import RecommendPostCard from "./RecommendPostCard";
export const PostList = ({ inputSearchValue }: { inputSearchValue: string }) => {
  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);

  const { posts, loading: loadingAll, error: errorAll } = useGetAllPosts();

  const { data: session } = useSession();
  const {
    posts: recommendedPosts,
    loading: loadingRecommended,
    error: errorRecommended,
  } = useGetRecommendPost(session?.user.id);

  const loading = loadingAll || loadingRecommended;
  const error = errorAll || errorRecommended;

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
          {recommendedPosts.length > 0 && <RecommendPostCard post={recommendedPosts[0]} key={recommendedPosts[0].id} />}
          {filter_posts.map((post: Post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};
