import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { usePostContext } from "@/context/postContext";

import PostCard from "./PostCard";

export const PostList = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [priceAsc, setPriceAsc] = useState(1);
  const [isBookmarkOnly, setIsBookmarkOnly] = useState(false);

  const { posts, recommendedPosts, loading, error, setPostsFilters } = usePostContext();

  const handleSortPrice = () => {
    const newOrder = priceAsc === 1 ? "desc" : "asc";
    setPostsFilters((prev) => ({ ...prev, sortBy: "price", sortOrder: newOrder }));
    setPriceAsc(-1 * priceAsc);
  };

  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  if (posts.length === 0 && posts.length === 0) {
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
            onClick={handleSortPrice}
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
            data-test-id="sort-by-price"
          >
            ราคา <span className="ml-2">{priceAsc === 1 ? "▲" : "▼"}</span>
          </button>
          {isAuthenticated && (
            <div className="hover:cursor-pointer" onClick={() => setIsBookmarkOnly((prev) => !prev)}>
              {isBookmarkOnly ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}
            </div>
          )}
        </div>
        <div className="m-2 ml-1.5 grid w-full grid-cols-1 gap-5 p-2 pt-8 text-lg lg:grid-cols-2 2xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};
