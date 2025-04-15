"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useGetAllBooks } from "@/hooks/useGetAllBooks";

const VerifyBooksPage = () => {
  const { books, loading, error } = useGetAllBooks();

  // Example URL generator – adjust to your actual image hosting setup
  const getCoverImageUrl = (key: string) => `https://your-cdn-or-s3.com/book-covers/${key}`;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Verify New Books</h1>
      {books.length === 0 ? (
        <p>No books to verify.</p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book.id} className="flex gap-4 rounded border p-4 shadow-sm">
              <div className="relative h-48 w-32 shrink-0">
                <Image src={book.coverImageUrl} alt={book.title} fill className="rounded object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Description:</strong> {book.description}
                  </p>
                  <p>
                    <strong>Pages:</strong> {book.pages}
                  </p>
                </div>
                <div className="mt-2 space-x-2">
                  <Button>Approve</Button>
                  <Button variant="destructive">Reject</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyBooksPage;
