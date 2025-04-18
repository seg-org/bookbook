"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { MypostParam, useGetMyPost } from "@/hooks/useGetAllPosts";

import { Pagination } from "./Pagination";
import PostCard from "./PostCard";

export const PostList = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  let popasc = 1;
  const [state, setState] = useState("createdAt");

  const [params, setParams] = useState<MypostParam>({
    page: 1,
    limit: 25,
    sortBy: "createdAt",
    sortOrder: "desc",
    author: userId ?? "",
  });

  const setPage = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const toggleSortBy = (field: "price" | "popularity") => {
    if (field === "popularity") {
      setState("popularity");
      popasc = 1 - popasc;
      setParams((prev) => ({
        ...prev,
        sortBy: field,
        sortOrder: popasc !== 1 && prev.sortOrder === "asc" ? "desc" : "asc",
      }));
    } else {
      setState("price");
      setParams((prev) => ({
        ...prev,
        sortBy: field,
        sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      }));
    }
  };

  const { posts, totalPages, loading, error } = useGetMyPost(params);

  const sortedPosts = useMemo(() => {
    if (params.sortBy !== "popularity") return posts;

    const order = params.sortOrder;
    const sorted = [...posts].sort(() => {
      if (popasc) return order === "asc" ? -1 : 1;
      return 0;
    });
    return sorted;
  }, [posts, params.sortBy, popasc, params.sortOrder]);

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
      <div className="item-center flex w-[99.5%] flex-col pt-8">
        <div className="flex flex-row items-center gap-5 self-start">
          <div className="ml-3.5 mr-auto mt-1 text-lg">เรียงโดย</div>
          <button
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
            data-test-id="sort-by-price"
            onClick={() => toggleSortBy("price")}
          >
            ราคา{" "}
            <span className="ml-2">{params.sortBy === "price" ? (params.sortOrder === "asc" ? "▲" : "▼") : "–"}</span>
          </button>
          <button
            onClick={() => toggleSortBy("popularity")}
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
          >
            ความนิยม{" "}
            <span className="ml-2">{state === "popularity" ? (params.sortOrder === "asc" ? "▲" : "▼") : "–"}</span>
          </button>
        </div>
        <div className="m-2 ml-1.5 flex w-full flex-wrap gap-5 p-2 pt-8 text-lg">
          {sortedPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      </div>
      <div>
        <Pagination totalPages={totalPages} setPage={setPage} page={params.page} />
      </div>
    </>
  );
};
