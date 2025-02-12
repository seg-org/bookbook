import { Book } from "@/data/dto/book.dto";
import BookCard from "./BookCard";
export const BookList = ({ books }: { books: Book[] }) => {
  return (
    <>
      <div className="item-center flex flex-col pt-8">
        <div className="m-2 ml-1.5 flex w-full flex-wrap gap-5 p-2 pt-8 text-lg">
          {books.map((book: Book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </div>
      </div>
    </>
  );
};
