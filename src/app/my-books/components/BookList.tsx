import { Book } from "@/data/dto/book.dto";
import { useState } from "react";
import BookCard from "./BookCard";
export const BookList = ({ books }: { books: Book[] }) => {
  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);

  return (
    <>
      <div className="item-center flex flex-col pt-8">
        <div className="flex flex-row gap-5 self-start">
          <div className="ml-3.5 mr-auto mt-1 text-lg">เรียงโดย</div>
          <button
            onClick={() => setPriceAsc(-1 * priceAsc)}
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
          >
            ราคา <span className="ml-2">{priceAsc == 1 ? "▲" : "▼"}</span>
          </button>
          <button
            onClick={() => setPopAsc(-1 * popAsc)}
            className="rounded-lg border border-gray-300 bg-white p-2 text-lg"
          >
            ความนิยม <span className="ml-2">{popAsc == 1 ? "▲" : "▼"}</span>
          </button>
        </div>
        <div className="m-2 ml-1.5 flex w-full flex-wrap gap-5 p-2 pt-8 text-lg">
          {books.map((book: Book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </div>
      </div>
    </>
  );
};
