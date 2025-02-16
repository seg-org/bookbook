import { LoadingAnimation } from "@/components/LoadingAnimation";
import { usePostContext } from "@/context/postContext";
import { Post } from "@/data/dto/post.dto";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PostCard from "./PostCard";
export const PostList = ({ inputSearchValue }: { inputSearchValue: string }) => {
  const { data: session } = useSession();
  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);

  const { posts, recommendedPosts, loading, error } = usePostContext();

  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  let filteredPosts = posts.filter((post) => post.book.title.toLowerCase().includes(inputSearchValue.toLowerCase()));
  filteredPosts = filteredPosts.filter((post) => post.sellerId !== session?.user.id);

  filteredPosts.sort(function (a, b) {
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
          {recommendedPosts.length > 0 && (
            <PostCard post={recommendedPosts[0]} key={recommendedPosts[0].id} isRecommended />
          )}
          {filteredPosts.map((post: Post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};
