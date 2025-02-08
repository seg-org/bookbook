import { Book } from "@/data/dto/book.dto";
import { useGetAllBooks } from "@/hooks/useGetAllBooks";
import BookCard from "./BookCard";

export const BookList = () => {
  const { books, loading, error } = useGetAllBooks();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Failed to get books</div>;
  }

  return (
    <div className="grid w-full grid-cols-auto-fit-400 gap-8 p-8 text-lg">
      {books.map((book: Book) => (
        <BookCard book={book} key={book.id} />
      ))}
    </div>
  );
};
