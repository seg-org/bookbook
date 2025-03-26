import clsx from "clsx";
import { Wrench } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { PostWithBookmark } from "@/context/postContext";




type PostCardProps = {
  post: PostWithBookmark;
  isRecommended?: boolean;
};

const cut = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

function PostCard({ post, isRecommended }: PostCardProps) {
  return (
    <>
    
      <div
        data-test-id="post-card"
        className={clsx(
          "flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white p-2 max-md:w-full md:w-[100%] lg:w-[48%] 2xl:w-[32%]",
          isRecommended && "border-4 border-amber-300"
        )}
      >
        <div className="m-2.5 flex flex-row justify-between text-lg">
          <h3>{post.title}</h3>
          <div className="flex items-center space-x-4">
            <span data-test-id="post-price">{post.price} ฿</span>
          </div>
        </div>
        <div className="m-2 flex w-full flex-row max-sm:text-sm">
          <Image
            className="m-2.5 h-40 w-auto rounded-lg"
            src={post.book.coverImageUrl}
            width={500}
            height={500}
            alt="Post Cover"
          />

          <div className="flex w-full flex-col pr-8 lg:h-[290px] xl:h-[320px] 2xl:h-[280px]">
            <div className="flex flex-grow flex-col gap-2">
              <div>
                <strong>ชื่อหนังสือ </strong>
                {post.book.title}
              </div>
              <div>
                <strong>ผู้เขียน </strong>
                {cut(post.book.author, 40)}
              </div>
              <div>
                <strong>ประเภท </strong>
                {cut(post.book.genre, 65)}
              </div>
              <div>
                <strong>สำนักพิมพ์ </strong>
                {cut(post.book.publisher, 40)}
              </div>
            </div>
            {isRecommended && <h3 className="self-end dark:text-white">(RECOMMENDED)</h3>}
          </div>
        </div>
        <div className="mt-auto flex gap-2 self-end">
          <Button variant="default">
            <div className="flex items-center justify-center gap-x-2">
               <Wrench className="h-6 w-6" /> แก้ไขข้อมูลโพสต์
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}

export default PostCard;
