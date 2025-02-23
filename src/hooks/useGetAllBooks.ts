import { useEffect, useState } from "react";

import { getAllBooks } from "@/data/book";
import { Book } from "@/data/dto/book.dto";

export const useGetAllBooks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getAllBooks();
      if (res instanceof Error) {
        return setError(res);
      }

      setBooks(res);
      setLoading(false);
    })();
  }, []);

  return { books, loading, error };
};
