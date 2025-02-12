import { getBooksBySeller } from "@/data/book";
import { Book } from "@/data/dto/book.dto";
import { useEffect, useState } from "react";

export const useGetBooksBySeller = (sellerId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getBooksBySeller(sellerId);
      if (res instanceof Error) {
        return setError(res);
      }

      setBooks(res);
      setLoading(false);
    })();
  }, [sellerId]);

  return { books, loading, error };
};
