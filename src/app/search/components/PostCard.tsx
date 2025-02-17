import { Button } from "@/components/ui/Button";
import { PostWithBookmark } from "@/context/postContext";
import { createChatRoom } from "@/data/chat";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingBasket } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoLogoWechat } from "react-icons/io5";
import { Bookmark } from "./Bookmark";

type PostCardProps = {
  post: PostWithBookmark;
  isRecommended?: boolean;
};

const cut = (s: string, n: number) => {
  if (s.length > n) {
    return s.slice(0, n) + "...";
  }
  return s;
};

function PostCard({ post, isRecommended }: PostCardProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const router = useRouter();

  const initiate_transaction = () => {
    const encodedPostId = encodeURIComponent(post.id);
    const encodedBookTitle = encodeURIComponent(post.book.title);
    const encodedPostPrice = encodeURIComponent(post.price.toString());
    router.push(`/buy?postId=${encodedPostId}&bookTitle=${encodedBookTitle}&postPrice=${encodedPostPrice}`);
  };

  const handleChatWithSeller = async (postId: string) => {
    if (!isAuthenticated || !session?.user) {
      router.push("/login");
      return;
    }

    await createChatRoom({ subject: "post", subjectId: postId });
    router.push(`/chat`);
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white p-2 max-md:w-full md:w-[100%] lg:w-[48%] xl:w-[32%]",
          isRecommended && "border-4 border-amber-300"
        )}
      >
        <div className="m-2.5 flex flex-row justify-between text-lg">
          <h3>{post.title}</h3>
          <div className="flex items-center space-x-4">
            <span>{post.price} ฿</span>
            {isAuthenticated && <Bookmark postId={post.id} initialState={post.isBookmarked} />}
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
                <strong>สำนักพิมพ์ </strong>
                {cut(post.book.publisher, 40)}
              </div>
              <div>
                <strong>รายละเอียด </strong>
                {cut(post.book.description, 65)}
              </div>
            </div>
            {isRecommended && <h3 className="self-end dark:text-white">(RECOMMENDED)</h3>}
          </div>
        </div>
        <div className="mt-auto flex gap-2 self-end">
          <Button variant="secondary">
            <div className="flex items-center justify-center gap-x-2">
              <IoIosInformationCircleOutline className="h-6 w-6" /> ดูข้อมูล
            </div>
          </Button>
          <Button onClick={() => handleChatWithSeller(post.id)}>
            <div className="flex items-center justify-center gap-x-2">
              <IoLogoWechat className="h-6 w-6" /> แชทกับผู้ขาย
            </div>
          </Button>
          <Button variant="success" onClick={initiate_transaction}>
            <div className="flex items-center justify-center gap-x-2">
              <FaShoppingBasket className="h-6 w-6" /> เพิ่มใส่ตะกร้า
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}

export default PostCard;
