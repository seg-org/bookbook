import { getUrl } from "@/app/api/objects/s3";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookmarkAction from "./BookmarkAction";
import PostAction from "./PostAction";

async function getPostAndBookDetail(postId: string) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      book: true,
      seller: true,
    },
  });
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await getPostAndBookDetail(id);

  if (post === null) {
    notFound();
  }
  return (
    <>
      <h1 className="my-4 text-center text-2xl font-bold">รายละเอียดโพสต์</h1>

      <main className="mx-auto flex w-2/3 flex-row items-start gap-4 rounded-lg bg-white p-8 shadow">
        <aside className="m-2.5 flex flex-col items-center gap-4">
          <Image
            className="w-96 rounded-lg"
            src={getUrl("book_images", post.book.coverImageKey)}
            width={1000}
            height={1000}
            alt="Post Cover"
          />

          <BookmarkAction postId={post.id} />
        </aside>

        <div className="w-fit text-lg">
          <div className="flex flex-row justify-between text-xl font-bold">
            <p>{post.title}</p>
            <p className="w-36 text-right">ราคา {post.price} บาท</p>
          </div>

          <br />

          <p>
            <span className="font-bold">ผู้ขาย </span>
            <span>
              {post.seller.firstName} {post.seller.lastName}
            </span>
          </p>
          <p>
            <span className="font-bold">ชื่อหนังสือ </span>
            <span>{post.book.title}</span>
          </p>
          <p>
            <span className="font-bold">คำอธิบาย </span>
            <span className="whitespace-pre-wrap">{post.book.description}</span>
          </p>
          <p>
            <span className="font-bold">ผู้เขียน </span>
            <span>{post.book.author}</span>
          </p>
          <p>
            <span className="font-bold">ประเภท </span>
            <span>{post.book.genre}</span>
          </p>
          <p>
            <span className="font-bold">สำนักพิมพ์ </span>
            <span>{post.book.publisher}</span>
          </p>

          <PostAction postId={post.id} bookTitle={post.book.title} postPrice={post.price} />
        </div>
      </main>
    </>
  );
}
