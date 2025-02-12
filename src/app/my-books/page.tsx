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
    <div className="mx-auto mt-10 max-w-6xl">
      <h1 className="text-center text-2xl font-bold">หนังสือของฉัน</h1>
      <BookList books={books} />
    </div>
  );
}
