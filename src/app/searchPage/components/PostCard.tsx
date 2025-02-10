import { Post } from "@/data/dto/post.dto";
import Image from "next/image";

type PostCardProps = {
  post: Post;
};

const cut = (s: String, n :number) => {
  if (s.length > n) {
    return s.slice(0, n) + "...";
  }
  return s;
};

function PostCard({ post }: PostCardProps) {
  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white max-md:w-full md:w-[100%] lg:w-[48%] xl:w-[32%]">
        <div className="m-2.5 flex flex-row justify-between text-lg">
          <h3>{post.title}</h3>
          <span>{post.price} ฿</span>
        </div>
        <div className="m-2 flex flex-row max-sm:text-sm w-full">
          <Image
            className="m-2.5 h-40 w-auto rounded-lg"
            src={post.book.coverImageUrl}
            width={500}
            height={500}
            alt="Post Cover"
          />

          <div className="flex flex-col h-full w-full pr-8 lg:h-[290px]">
            <div className="flex-grow">
              <div>
                <strong>ชื่อหนังสือ </strong>
                {post.book.title}
              </div>
              <div>
                <strong>ผู้เขียน </strong>
                {post.book.author}
              </div>
              <div>
                  <strong>รายละเอียด</strong>
                  {cut(post.book.description,80)}
              </div>
            </div>
            <div className="flex gap-2 mt-auto self-end">
              <button className="cursor-pointer rounded-sm border-2 border-[#B8B8B8] bg-white p-1.5 text-sm text-black">
                ดูข้อมูล
              </button>
              <button className="cursor-pointer rounded-sm border-2 border-[#B8B8B8] bg-[#8BB9D8] p-1.5 text-sm text-white">
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
