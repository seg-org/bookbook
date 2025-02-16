import { Post } from "@/data/dto/post.dto";
import { PostFilterCondition } from "@/data/dto/postFilterCondition";
import { useFilteredPosts } from "@/hooks/useGetFilteredPostsSearch";
import React, { useState } from "react";
import PostCard from "./PostCard";

function SearchByDetail() {
  const [formData, setFormData] = useState<PostFilterCondition>({ title: "", author: "", publisher: "", isbn: "" });
  const { posts, loading, error } = useFilteredPosts(formData);
  let [postsFromFilter, setPostsFromFilter] = useState([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //----------------------------------
    //cant use hook inside an event handler. idk
    const filteredPost = await fetch("/api/posts/filtered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!filteredPost.ok) {
      throw new Error(`Error: ${filteredPost.status}`);
    }

    const data = await filteredPost.json(); // Convert response to JSON
    setPostsFromFilter(data);
    console.log("Filtered posts:", data);
    //-----------------------------------
  };

  return (
    <>
      <div className="w-[40%]">
        <div className="mb-3 pr-3 font-semibold">ค้นหาหนังสือด้วยรายละเอียดเพิ่มเติม</div>
        <form className="grid gap-2.5" onSubmit={handleSubmit}>
          <input
            className="rounded-md border border-gray-300 p-2.5"
            name="title"
            type="text"
            placeholder="ชื่อหนังสือ"
            value={formData.title}
            onChange={handleChange}
          ></input>
          <input
            className="rounded-md border border-gray-300 p-2.5"
            name="author"
            type="text"
            placeholder="ผู้เขียน"
            value={formData.author}
            onChange={handleChange}
          ></input>
          <input
            className="rounded-md border border-gray-300 p-2.5"
            name="publisher"
            type="text"
            placeholder="สำนักพิมพ์"
            value={formData.publisher}
            onChange={handleChange}
          ></input>
          <input
            className="rounded-md border border-gray-300 p-2.5"
            name="isbn"
            type="text"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleChange}
          ></input>
          <button className="cursor-pointer rounded-md border-none bg-[#9dc4de] p-2.5 text-white">
            ค้นหาข้อมูลด้วยรายละเอียดเพิ่มเติม
          </button>
        </form>
      </div>
      {postsFromFilter.length != 0 && (
        <div className="ml-1.5 flex w-full flex-wrap gap-5 p-2 pt-8 text-lg">
          {postsFromFilter.map((post: Post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      )}
    </>
  );
}

export default SearchByDetail;
