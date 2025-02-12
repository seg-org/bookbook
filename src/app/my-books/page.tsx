"use client";

import { useGetBooksBySeller } from "@/hooks/useGetBooksBySeller";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BookList } from "./components/BookList";

export default function MyBooksPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) {
    redirect("/login");
  }

  const { books, loading, error } = useGetBooksBySeller(session.user.id);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="mx-auto mt-10 max-w-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">My Books</h1>
      <BookList books={books} />
    </div>
  );
}
