"use client";
import { useEffect, useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { PostWithBookmark } from "@/context/postContext";

import { Pagination } from "./Pagination";
import PostCard from "./PostCard";

export const PostList = () => {
  const statusLabels: Record<string, string> = {
    VERIFIED: "ตรวจสอบแล้ว",
    CHANGE_REQUESTED: "รอการแก้ไข",
    UNDER_REVIEW: "รอการตรวจสอบ",
  };
  const [selectedStatus, setSelectedStatus] = useState<string>("VERIFIED");
  const [priceAsc, setPriceAsc] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const [posts, setPosts] = useState<PostWithBookmark[]>([]);

  const fetchPosts = () => {
    setLoading(true);
    fetch(
      `/api/posts/get-own-posts?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}&verifiedStatus=${selectedStatus}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, sortOrder, selectedStatus, page]);

  useEffect(() => {
    setLoading(false);
  }, [posts]);

  useEffect(() => {
    setSortBy("price");
    setSortOrder(priceAsc === 1 ? "asc" : "desc");
  }, [priceAsc]);

  const handleSortPrice = () => {
    setPriceAsc(-1 * priceAsc);
  };

  const handleCheckbox = (status: string) => {
    setSelectedStatus(status);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  // if (error) {
  //   return <div>Failed to get posts</div>;
  // }

  return (
    <>
      <div className="item-center flex min-w-full flex-col pt-8">
        <div className="flex flex-row items-center gap-5 self-start">
          <div className="ml-3.5 mr-auto mt-1 text-lg">เรียงโดย</div>
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
                  onChange={() => {
                    handleCheckbox(status);
                  }}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {statusLabels[status]}
              </label>
            ))}
          </div>
        </div>
        {posts.length == 0 ? (
          <div className="flex h-96 w-full items-center justify-center">
            <div className="text-lg">ไม่พบโพสต์</div>
          </div>
        ) : (
          <div className="m-2 ml-1.5 grid w-full grid-cols-1 gap-5 p-2 pt-8 text-lg lg:grid-cols-2 2xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onPostUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
      <Pagination totalPages={totalPages} setPage={setPage} cur_page={page} />
    </>
  );
};
