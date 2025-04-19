"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Book } from "@/data/dto/book.dto";

const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/admin/verify-new-book/${book.id}`);
  };

  const cut = (s: string, n: number) => {
    if (s.length > n) {
      return s.slice(0, n) + "...";
    }
    return s;
  };

  return (
    <div
      onClick={goToDetail}
      className="flex cursor-pointer gap-4 rounded border border-gray-300 p-4 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-gray-500 hover:shadow-lg"
    >
      <div className="relative h-48 w-32 shrink-0">
        <Image src={book.coverImageUrl} alt={book.title} fill className="rounded object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Publisher:</strong> {book.publisher}
          </p>
          <p>
            <strong>Description:</strong> {cut(book.description, 30)}
          </p>
          <p>
            <strong>Pages:</strong> {book.pages}
          </p>
        </div>
        <div className="mt-4 space-x-2">
          <Button className="bg-green-500 text-white hover:bg-green-600">Approve</Button>
          <Button className="bg-red-500 text-white hover:bg-red-600">Reject</Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
