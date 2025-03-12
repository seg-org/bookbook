"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { GetBookQuery } from "@/data/book";
import { useGetBooks } from "@/hooks/useGetAllBooks";

type BookListProps = {
  query: GetBookQuery;
};

export default function BookList({ query }: BookListProps) {
  const { books, loading, error } = useGetBooks(query);

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
              {book.genre} | {book.pages} หน้า | ISBN {book.isbn}
            </p>
          </div>

          <Link href={`/book/sell/${book.id}`}>
            <Button className="w-32">ขายเล่มนี้</Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
