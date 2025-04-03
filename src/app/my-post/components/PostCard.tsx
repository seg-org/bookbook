import { Wrench } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

/**
 * Renders a post card UI displaying the details of a book-related post.
 *
 * In its default mode, the component displays the post's title, price, book cover, and additional book details
 * (book title, author, genre, publisher). When edit mode is activated, the title and price fields become editable,
 * allowing users to modify these values. Canceling an edit reverts the changes to the original post information.
 *
 * @param post - An object containing the post details, including the title, price, and associated book information.
 */
function PostCard({ post }: PostCardProps) {
  const [editMode, setEditMode] = useState(false);

  const [editedPost, setEditedPost] = useState({
    title: post.title,
    price: post.price,
  });

  const oldPost = {
    title: post.title,
    price: post.price,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div
        data-test-id="post-card"
        className={"flex w-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white p-2"}
      >
        <div className="m-2.5 flex flex-row justify-between text-lg">
          {editMode ? (
            <input
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              className="rounded border border-gray-300 p-1"
            />
          ) : (
            <h3>{post.title}</h3>
          )}
          <div className="flex items-center space-x-4">
            {editMode ? (
              <input
                name="price"
                type="number"
                value={editedPost.price}
                onChange={handleChange}
                className="w-20 rounded border border-gray-300 p-1"
              />
            ) : (
              <span data-test-id="post-price">{post.price} ฿</span>
            )}
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
          </div>
        </div>
        <div className="mt-auto flex gap-2 self-end">
          {editMode && (
            <>
              <Button
                variant="default"
                className="bg-white text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  setEditedPost(oldPost);
                  setEditMode(false);
                }}
              >
                <div className="flex items-center justify-center gap-x-2">ยกเลิกการแก้ไข</div>
              </Button>
              <Button variant="default" className="text-green-500 hover:bg-green-500 hover:text-white">
                <div className="flex items-center justify-center gap-x-2">บันทึกการแก้ไข</div>
              </Button>
            </>
          )}
          {!editMode && (
            <Button variant="default">
              <div className="flex items-center justify-center gap-x-2" onClick={() => setEditMode(true)}>
                <Wrench className="h-6 w-6" /> แก้ไขข้อมูลโพสต์
              </div>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default PostCard;
