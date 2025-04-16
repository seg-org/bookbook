"use client";

import Image from "next/image";
import { use } from "react";

import { useGetBook } from "@/hooks/useGetBook";

export default function VerifyBookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { book, loading, error } = useGetBook(id);

  return (
    <div className="p-6">
      {loading && <p className="text-center text-lg font-semibold">Loading books...</p>}
      {error && <p className="text-center text-lg text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <div>
          {!book ? (
            <p className="text-center text-lg">No books to verify.</p>
          ) : (
            <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="relative h-96 w-full">
                <Image src={book.coverImageUrl} alt={book.title} fill className="rounded-t-lg object-cover" />
              </div>

              <div className="space-y-4 p-6">
                <h1 className="text-center text-4xl font-bold text-gray-800">{book.title}</h1>

                <p className="text-xl text-gray-600">
                  <strong>Author:</strong> {book.author}
                </p>

                {book.bookGenres && (
                  <p className="text-xl text-gray-600">
                    <strong>Genres:</strong> {book.bookGenres.join(", ")}
                  </p>
                )}
                {book.bookTags && (
                  <p className="text-xl text-gray-600">
                    <strong>Tags:</strong> {book.bookTags.join(", ")}
                  </p>
                )}
                <p className="text-xl text-gray-600">
                  <strong>ISBN:</strong> {book.isbn}
                </p>

                <p className="text-xl text-gray-600">
                  <strong>Publisher:</strong> {book.publisher}
                </p>

                <p className="text-xl text-gray-600">
                  <strong>Description:</strong> {book.description}
                </p>

                <p className="text-xl text-gray-600">
                  <strong>Pages:</strong> {book.pages}
                </p>

                <div className="flex justify-center space-x-4">
                  <button className="rounded-lg bg-green-600 px-6 py-2 text-white shadow-md transition hover:bg-green-700">
                    Approve
                  </button>
                  <button className="rounded-lg bg-red-600 px-6 py-2 text-white shadow-md transition hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
