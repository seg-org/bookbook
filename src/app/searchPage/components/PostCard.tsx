import { Post } from "@/data/dto/post.dto";
import Image from "next/image";

type PostCardProps = {
  post: Post;
};


const cut=(s:String)=>{
  if(s.length>50){
    return s.slice(0,50)+"...";
  }
  return s
}

function PostCard({ post }: PostCardProps) {
  return (
    <>
  <div className="flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white p-2.5 w-[425px]">
    <div className="m-2.5 flex flex-row justify-between text-lg">
      <h3>{post.title}</h3>
      <span>{post.price} ฿</span>
    </div>
    <div className="m-2.5 flex flex-row">
      <Image
        className="m-2.5 h-40 w-auto rounded-lg"
        src={post.book.coverImageUrl}
        width={500}
        height={500}
        alt="Post Cover"
      />
      <div className="flex flex-col justify-between max-h-[275px]"> {/* Removed h-screen */}
        <div>
          <div>
            <strong>ชื่อหนังสือ </strong>
            {post.book.title}
          </div>
          <div>
            <strong>ผู้เขียน </strong>
            {post.book.author}
          </div>
          <div>
            <div>
              <strong>รายละเอียด</strong>
            </div>
            {cut(post.book.description)}
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-center">
          <button className="m-2.5 cursor-pointer rounded-sm border-2 border-[#B8B8B8] bg-white p-1.5 px-4 py-2 pl-2 pr-2 text-sm text-black">
            <div>ดูข้อมูล</div>
          </button>
          <button className="rounded-sm border-2 border-[#B8B8B8] bg-[#8BB9D8] p-1.5 px-4 py-2 pl-2 pr-2 text-sm text-white">
            เพิ่มใส่ตะกร้า
          </button>
        </div>
      </div>
    </div>
  </div>
</>
  );
}

export default PostCard;
