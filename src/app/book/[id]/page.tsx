import Image from "next/image";
import { notFound } from "next/navigation";

import { getUrl } from "@/app/api/objects/s3";
import { prisma } from "@/lib/prisma";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (book === null) {
    notFound();
  }

  return (
    <>
      <h1 className="my-4 text-center text-2xl font-bold">รายละเอียดหนังสือ</h1>

      <main className="mx-auto flex w-2/3 flex-row items-start gap-4 rounded-lg bg-white p-8 shadow">
        <aside className="m-2.5">
          <Image
            className="w-96 rounded-lg"
            src={getUrl("book_images", book.coverImageKey)}
            width={1000}
            height={1000}
            alt="Book Cover"
          />
        </aside>

        <section className="w-fit text-lg">
          <p className="text-xl font-bold">{book.title}</p>

          <br />

          <p>
            <span className="font-bold">คำอธิบาย </span>
            <span className="whitespace-pre-wrap">{book.description}</span>
          </p>
          <p>
            <span className="font-bold">ผู้เขียน </span>
            <span>{book.author}</span>
          </p>
          <p>
            <span className="font-bold">ประเภท </span>
            <span>{book.genre}</span>
          </p>
          <p>
            <span className="font-bold">สำนักพิมพ์ </span>
            <span>{book.publisher}</span>
          </p>
        </section>
      </main>
    </>
  );
}
