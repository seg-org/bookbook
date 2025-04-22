import { useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { usePostContext } from "@/context/postContext";

import PostCard from "./PostCard";

export const PostList = () => {
  const [priceAsc, setPriceAsc] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { posts, loading, error, setPostsFilters } = usePostContext();

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

  if (posts.length === 0) {
    return (
      <div data-test-id="no-posts-found" className="mt-10">
        ไม่พบโพสต์ตามที่ระบุไว้ฮะ
      </div>
    );
  }

  return (
    <>
      <div className="item-center flex flex-col pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 px-4">
            <div className="text-lg">เรียงโดย</div>
            <button
              onClick={handleSortPrice}
              className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
              data-test-id="sort-by-price"
            >
              ราคา <span className="ml-2">{priceAsc === 1 ? "▲" : "▼"}</span>
            </button>
            <div className="flex flex-row gap-4 px-4 pt-4">
              {["VERIFIED", "CHANGE_REQUESTED", "UNDER_REVIEW"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatus === status}
                    onChange={() => setSelectedStatus((prev) => (prev === status ? null : status))}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>
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
