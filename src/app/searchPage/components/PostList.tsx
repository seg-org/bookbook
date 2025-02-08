import { Post } from "@/data/dto/post.dto";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import PostCard from "./PostCard";
import { useState } from "react";
export const PostList = ({prop}) => {
  const [priceAsc,setPriceAsc] = useState(1);
  const [popAsc,setPopAsc] = useState(1);

  const { posts, loading, error } = useGetAllPosts();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Failed to get posts</div>;
  }

  const filter_posts=posts.filter((post) =>
    post.title.toLowerCase().includes(prop.toLowerCase())
  );

  filter_posts.sort(function(a,b){
    return priceAsc*(a.price - b.price);
  });

  return (
    <>
  <div className="flex flex-row gap-5 mt-5 self-start pl-8">
    <div className="mr-auto">เรียงโดย</div>
    <button onClick={()=>setPriceAsc(-1*priceAsc)} className="rounded-m bg-white text-sm">ราคา {priceAsc==1 ? "▲":"▼"}</button>
    <button onClick={()=>setPopAsc(-1*popAsc)} className="rounded-m bg-white text-sm">ความนิยม {popAsc==1 ? "▲":"▼"}</button>
  </div>
  <div className="grid-cols-auto-fit-400 grid w-full gap-8 p-8 text-lg">
    {filter_posts.map((post: Post) => (
      <PostCard post={post} key={post.id} />
    ))}
  </div>
</>
  );
};
