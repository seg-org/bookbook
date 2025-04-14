import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { getRecommendPrice } from "@/app/api/books/recommend-price/getRecommendPrice";
import { getUrl } from "@/app/api/objects/s3";
import { Button } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookTagInThai, genreInThai } from "@/lib/translation";

export default async function SellBookConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/login");
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!seller) {
    return <h1 className="my-4 text-center text-2xl font-bold">กรุณาลงทะเบียนผู้ขายก่อนใช้งาน</h1>;
  }

  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (book === null) {
    notFound();
  }

  const recommendPrice = await getRecommendPrice(id);

  async function createPost(formData: FormData) {
    "use server";

    if (!book || !seller?.userId || !session?.user.id) {
      throw new Error("Book or seller or session not found");
    }

    const postTitle = formData.get("post-title");
    const price = formData.get("book-price");

    if (typeof postTitle !== "string") {
      throw new Error("Post title is required");
    }
    if (typeof price !== "string") {
      throw new Error("Price is required");
    }

    const { id } = await prisma.post.create({
      data: {
        title: postTitle,
        price: Math.round(+price),
        published: true,
        sellerId: session.user.id,
        bookId: book.id,
        damage: "NO_DAMAGED",
      },
    });

    redirect(`/post/${id}`);
  }

  return (
    <>
      <h1 className="my-4 text-center text-2xl font-bold">ขายหนังสือ</h1>

      <main className="mx-auto flex w-2/3 flex-row items-start gap-4 rounded-lg bg-white p-8 shadow">
        <aside className="m-2.5">
          <Image
            className="w-96 rounded-lg"
            src={getUrl("book_images", book.coverImageKey)}
            width={200}
            height={200}
            alt="Book Cover"
          />
        </aside>

        <section className="w-fit text-lg">
          <p className="text-xl font-bold">{book.title}</p>

          <br />

          <p>
            <span className="font-bold">ผู้เขียน </span>
            <span>{book.author}</span>
          </p>
          <p>
            <span className="font-bold">ประเภท </span>
            <span>{book.bookGenres.map((key) => genreInThai[key]).join(", ")}</span>
          </p>
          <p>
            <span className="font-bold">แท็ก </span>
            <span>{book.bookTags.map((key) => bookTagInThai[key]).join(", ")}</span>
          </p>
          <p>
            <span className="font-bold">สำนักพิมพ์ </span>
            <span>{book.publisher}</span>
          </p>

          <form action={createPost} className="mt-8 flex flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-2">
              <label htmlFor="post-title">ชื่อโพสต์</label>
              <input
                id="post-title"
                data-testid="post-title"
                name="post-title"
                className="w-full rounded border border-black p-2"
                type="text"
                required
              />
            </div>

            <div className="flex w-full flex-col items-start gap-2">
              <label htmlFor="book-price">
                ราคาที่ขาย {recommendPrice ? `(ราคาขายแนะนำ: ${Math.round(recommendPrice)} บาท)` : undefined}
              </label>
              <input
                id="book-price"
                data-testid="book-price"
                name="book-price"
                className="w-full rounded border border-black p-2"
                type="number"
                placeholder={`${recommendPrice ? Math.round(recommendPrice) : ""}`}
                required
              />
            </div>

            <Button type="submit">โพสต์ขายหนังสือ</Button>
          </form>
        </section>
      </main>
    </>
  );
}
