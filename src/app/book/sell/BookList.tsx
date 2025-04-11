"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import { deleteBook, GetBookQuery } from "@/data/book";
import { useGetBooks } from "@/hooks/useGetAllBooks";

type BookListProps = {
  query: GetBookQuery;
};

export default function BookList({ query }: BookListProps) {
  const { books, loading, error } = useGetBooks(query);
  const { data: session } = useSession();
  const router = useRouter();

  const handleDeleteBook = async (id: string) => {
    const confirmed = confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือเล่มนี้? \nการลบหนังสือจะทำให้ข้อมูลทั้งหมดของหนังสือเล่มนี้หายไปรวมถึง โพสต์ขาย แชท รายงาน การขาย และอื่นๆ ของหนังสือเล่มนี้ \n\nหากคุณต้องการลบหนังสือเล่มนี้จริงๆ กรุณากด OK",
    );
    if (!confirmed) return;

    const res = await deleteBook(id);
    if (res instanceof Error) {
      console.error(res);
      alert("ไม่สามารถลบหนังสือได้");
    }
    router.refresh();
  };

  return loading ? (
    <p>กำลังค้นหา...</p>
  ) : error ? (
    <p className="text-red-500">Error {error.message}</p>
  ) : (
    // todo responsive
    <ul className="flex w-2/3 flex-col gap-4">
      {books.map((book) => (
        <li key={book.id} className="flex w-full items-center gap-4 rounded-lg bg-white p-4 shadow">
          <Image src={book.coverImageUrl} alt={book.title} width={100} height={100} />

          <div className="w-full self-start">
            <p className="text-xl font-bold">{book.title}</p>
            <p>โดย {book.author}</p>
            <p>สำนักพิมพ์ {book.publisher}</p>
            <p>
              {book.pages} หน้า | ISBN {book.isbn}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Link href={`/book/sell/${book.id}`}>
              <Button className="w-32">ขายเล่มนี้</Button>
            </Link>
            {session?.user.isAdmin && (
              <>
                <Link href={`/book/${book.id}/edit`}>
                  <Button variant="outline" className="w-32">
                    แก้ไขข้อมูล
                  </Button>
                </Link>
                <Button variant="destructive" className="w-32" onClick={() => handleDeleteBook(book.id)}>
                  ลบหนังสือ
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
