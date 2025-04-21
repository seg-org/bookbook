"use client";

import { useMemo } from "react";

import { useGetBooks } from "@/hooks/useGetAllBooks";

import BookCard from "./BookCard";

const VerifyBooksPage = () => {
  //useGetAllBook. idk how to get new book

  const query = useMemo(() => ({ verifiedStatus: "UNVERIFIED" }), []);
  const { books, loading, error } = useGetBooks(query);
  console.log(books[0]);
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Verify New Books</h1>

      {loading && <p>Loading books...</p>}

      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!loading &&
        !error &&
        (books.length === 0 ? (
          <p>No books to verify.</p>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ))}
    </div>
  );
};

export default VerifyBooksPage;
