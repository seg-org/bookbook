import BookCard from "@/app/searchPage/components/BookCard";
import { Book } from "@/types/book";

type BookListProps = {
  books: Book[];
};

function BookList({ books }: BookListProps) {
  return (
    // TODO: change this to tailwind
    <div className="book-list">
      {books.map((book: Book) => (
        <BookCard book={book} key={book.id}></BookCard>
      ))}
    </div>
  );
}

export default BookList;
