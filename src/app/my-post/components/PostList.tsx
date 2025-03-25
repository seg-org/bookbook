import {  useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { usePostContext } from "@/context/postContext";

import PostCard from "./PostCard";

export const PostList = () => {


  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);

  const { posts, loading, error, setPostsFilters } = usePostContext();


  const handleSortPrice = () => {
    setPostsFilters((prev) => ({ ...prev, sortPrice: priceAsc === 1 ? "desc" : "asc" }));
    setPriceAsc((prev) => -1 * prev);
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
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};
