import { useEffect, useState } from "react";
import { getUnverifiedBooks } from "@/data/book";
import { Book } from "@/data/dto/book.dto";

export const useGetUnverifiedBooks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getUnverifiedBooks();
      if (res instanceof Error) {
        return setError(res);
      }

      setBooks(res);
      setLoading(false);
    })();
  }, []);

  return { books, loading, error };
};
