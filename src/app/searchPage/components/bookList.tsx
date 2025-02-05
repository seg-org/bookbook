import BookCard from "@/app/searchPage/components/BookCard";
import { Book } from "@/types/book";

type BookListProps = {
  books: Book[];
};

function BookList({ books }: BookListProps) {
  return (
    <div className="grid-cols-auto-fit-400 grid w-full gap-8 p-8 text-lg">
      {books.map((book: Book) => (
        <BookCard book={book} key={book.id} />
      ))}
    </div>
  );
}

export default BookList;
