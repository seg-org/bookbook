import { Post } from "@/data/dto/post.dto";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import PostCard from "./PostCard";
import { useState } from "react";
export const PostList = ({inputSearchValue}:{inputSearchValue:String}) => {
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
    post.title.toLowerCase().includes(inputSearchValue.toLowerCase())
  );

  filter_posts.sort(function(a,b){
    return priceAsc*(a.price - b.price);
  });

  return (
    <>
    <div className="flex flex-col item-center pt-8">
  <div className="flex flex-row gap-5 self-start">
    <div className="ml-3.5 mr-auto">เรียงโดย</div>
    <button onClick={()=>setPriceAsc(-1*priceAsc)} className="rounded-m bg-white text-sm">ราคา {priceAsc==1 ? "▲":"▼"}</button>
    <button onClick={()=>setPopAsc(-1*popAsc)} className="rounded-m bg-white text-sm">ความนิยม {popAsc==1 ? "▲":"▼"}</button>
  </div>
  <div className="flex flex-wrap w-full gap-5 m-2 p-2 pt-8 text-lg ml-1.5">
    {filter_posts.map((post: Post) => (
      <PostCard post={post} key={post.id} />
    ))}
  </div>
  </div>
</>
  );
};
