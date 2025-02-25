import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { usePostContext } from "@/context/postContext";

import PostCard from "./PostCard";

export const PostList = ({ inputSearchValue }: { inputSearchValue: string }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);
  const [isBookmarkOnly, setIsBookmarkOnly] = useState(false);

  const { posts, recommendedPosts, loading, error } = usePostContext();

  const filteredPosts = useMemo(() => {
    let filteredPosts = posts.filter((post) => post.book.title.toLowerCase().includes(inputSearchValue.toLowerCase()));
    filteredPosts = filteredPosts.filter((post) => post.sellerId !== session?.user.id);
    if (isBookmarkOnly) {
      filteredPosts = filteredPosts.filter((post) => post.isBookmarked);
    }

    return filteredPosts;
  }, [posts, inputSearchValue, session?.user.id, isBookmarkOnly]);

  filteredPosts.sort(function (a, b) {
    return priceAsc * (a.price - b.price);
  });

  const filteredRecommendedPosts = useMemo(() => {
    let filteredRecommendedPosts = recommendedPosts.filter((post) =>
      post.book.title.toLowerCase().includes(inputSearchValue.toLowerCase())
    );
    filteredRecommendedPosts = filteredRecommendedPosts.filter((post) => post.sellerId !== session?.user.id);

    return filteredRecommendedPosts;
  }, [recommendedPosts, inputSearchValue, session?.user.id]);

  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  if (filteredPosts.length === 0 && filteredRecommendedPosts.length === 0) {
    return (
      <div data-test-id="no-posts-found" className="mt-10">
        ไม่พบโพสต์ตามที่ระบุไว้ฮะ
      </div>
    );
  }

  return (
    <>
      <div className="item-center flex flex-col pt-8">
        <div className="flex flex-row items-center gap-5 self-start">
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
          {isAuthenticated && (
            <div className="hover:cursor-pointer" onClick={() => setIsBookmarkOnly((prev) => !prev)}>
              {isBookmarkOnly ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}
            </div>
          )}
        </div>
        <div className="m-2 ml-1.5 flex w-full flex-wrap gap-5 p-2 pt-8 text-lg">
          {!isBookmarkOnly && filteredRecommendedPosts.length > 0 && (
            <PostCard post={filteredRecommendedPosts[0]} key={filteredRecommendedPosts[0].id} isRecommended />
          )}
          {filteredPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};
