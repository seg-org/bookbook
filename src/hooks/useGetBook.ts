import { useEffect, useState } from "react";

import { getBook } from "@/data/book";
import { Book } from "@/data/dto/book.dto";

export const useGetBook = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    (async () => {
      const res = await getBook(id);
      if (res instanceof Error) {
        return setError(res);
      }

      setBook(res);
      setLoading(false);
    })();
  }, [id]);

  return { book, loading, error };
};
