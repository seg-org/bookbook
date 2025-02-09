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
          <div className="flex flex-col flex-end justify-between pr-8">
            <div>
              <div>
                <strong>ชื่อหนังสือ </strong>
                {post.book.title}
              </div>
              <div>
                <strong>ผู้เขียน </strong>
                {cut(post.book.author,20)}
              </div>
              <div>
                <div>
                  <strong>รายละเอียด</strong>
                </div>
                {cut(post.book.description,50)}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-auto">
              <button className="m-1 cursor-pointer rounded-sm border-2 border-[#B8B8B8] bg-white p-1.5 text-sm text-black">
                ดูข้อมูล
              </button>
              <button className="m-1 cursor-pointer rounded-sm border-2 border-[#B8B8B8] bg-[#8BB9D8] p-1.5 text-sm text-white">
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
