import Image from "next/image";
import { useContext, useState } from "react";
import { Wrench } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { editPost } from "@/data/post";
import { PostContext, PostWithBookmark } from "@/context/postContext";
import { bookTagInThai, genreInThai } from "@/lib/translation";

type PostCardProps = {
  post: PostWithBookmark;
};

const cut = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

function PostCard({ post }: PostCardProps) {
  const [editMode, setEditMode] = useState(false);
  const { refetchPosts } = useContext(PostContext);
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    price: post.price,
    bookId: post.bookId,
  });

  const oldPost = {
    title: post.title,
    price: post.price,
    bookId: post.bookId,
  };

  const onSubmit = async (id: string) => {
    try {
      const res = await editPost(editedPost, id);
      if (res instanceof Error) {
        console.error(res);
      }
    } catch (error) {
      console.error("Error posting book:", error);
    }
    setEditMode(false);
    refetchPosts?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price") {
      setEditedPost((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setEditedPost((prev) => ({ ...prev, [name]: value }));
    }
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
                {cut(post.book.bookGenres?.map((key) => genreInThai[key]).join(", ") || "", 65)}
              </div>
              <div>
                <strong>แท็ก </strong>
                {cut(post.book.bookTags?.map((key) => bookTagInThai[key]).join(", ") || "", 65)}
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
              <Button
                variant="default"
                className="text-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => onSubmit(post.id)}
              >
                <div className="flex items-center justify-center gap-x-2">บันทึกการแก้ไข</div>
              </Button>
            </>
          )}
          {!editMode && (
            <Button variant="default" onClick={() => setEditMode(true)} className="bg-yellow-500 hover:bg-yellow-700">
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
