import { Book } from "@/types/book";
import BookCard from "./BookCard";

type BookListProps = {
  books: Book[];
};

function BookList({ books }: BookListProps) {
  return (
    <div className="grid w-full grid-cols-auto-fit-400 gap-8 p-8 text-lg">
      {books.map((book: Book) => (
        <BookCard book={book} key={book.id} />
      ))}
    </div>
  );
}

export default BookList;
