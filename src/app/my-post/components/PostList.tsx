"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";

import PostCard from "./PostCard";
import { useGetMyPost } from "@/hooks/useGetAllPosts";
import { Pagination } from "./Pagination";

export const PostList = () => {
  const { data: session } = useSession();

  const [priceAsc, setPriceAsc] = useState(1);
  const [sortBy, setSortBy] = useState<{ field: string; order: string } | null>(null); // e.g., { field: "price", order: "asc" }

  const [params, setParams] = useState({
    page: 1,
    limit: 27,
    sortBy: "price",
    sortOrder: "asc",
    author: session?.user.id || "",
  });

  const setpage = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page: page,
    }));
  };

  useEffect(() => {
    if (sortBy) {
      setParams((prev) => ({
        ...prev,
        sortBy: sortBy.field,
        sortOrder: sortBy.order,
      }));
    }
  }, [sortBy]);

  const { posts, totalPages, loading, error } = useGetMyPost(params);

  const handleSortPrice = () => {
    const newOrder = priceAsc === 1 ? "desc" : "asc";
    setSortBy({ field: "price", order: newOrder });
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
        ไม่พบโพสต์ของคุณ
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
        </div>
        <div className="m-2 ml-1.5 grid w-full grid-cols-1 gap-5 p-2 pt-8 text-lg lg:grid-cols-2 2xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
      <Pagination totalPages={totalPages} setPage={setpage} cur_page={params.page} />
    </>
  );
};
