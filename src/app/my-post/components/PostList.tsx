"use client";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { usePostContext } from "@/context/postContext";

import PostCard from "./PostCard";

export const PostList = () => {
  const { data: session } = useSession();

  const [priceAsc, setPriceAsc] = useState(1);
  const [sortBy, setSortBy] = useState<{ field: string; order: string } | null>(null); // e.g., { field: "price", order: "asc" }

  const { posts, recommendedPosts, loading, error } = usePostContext();

  const filteredPosts = useMemo(() => {
    const filteredPosts = posts.filter((post) => post.sellerId !== session?.user.id);

    return filteredPosts;
  }, [posts, session?.user.id]);

  const filteredRecommendedPosts = useMemo(() => {
    const filteredRecommendedPosts = recommendedPosts.filter((post) => post.sellerId !== session?.user.id);
    return filteredRecommendedPosts;
  }, [recommendedPosts, session?.user.id]);

  const handleSortPrice = () => {
    const newOrder = priceAsc === 1 ? "desc" : "asc";
    setSortBy({ field: "price", order: newOrder });
    setPriceAsc(-1 * priceAsc);
  };

  const sortedPosts = useMemo(() => {
    if (!sortBy) return filteredPosts;

    const { field, order } = sortBy;
    const sorted = [...filteredPosts].sort((a, b) => {
      let valA, valB;
      if (field === "price") {
        valA = a.price;
        valB = b.price;
      } else {
        return 0;
      }
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPosts, sortBy]);

  if (loading) {
    return <LoadingAnimation />;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  if (filteredPosts.length === 0 && filteredRecommendedPosts.length === 0) {
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
          {sortedPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
    </>
  );
};
