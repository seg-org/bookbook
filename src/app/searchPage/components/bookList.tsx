import { Book } from "@/types/book";
import BookCard from "./bookCard";
import { useState } from "react";

type BookListProps = {
  books: Book[];
};

function BookList({ books }: BookListProps) {

  const [priceAsc, setPriceAsc] = useState(1);
  const [popAsc, setPopAsc] = useState(1);
  books.sort(function(a,b){
    if(a.price === b.price){
      return popAsc*(a.popular - b.popular)
    }
    return priceAsc*(a.price - b.price);
  });
  return (
  <>
    <div className="flex flex-row gap-5">
      <div>เรียงโดย</div>
      <button onClick={()=>setPriceAsc(-1*priceAsc)} className="rounded-m bg-white text-sm">ราคา {priceAsc==1 ? `u` : `d`}</button>
      <button onClick={()=>setPopAsc(-1*popAsc)} className="rounded-m bg-white text-sm">ความนิยม {popAsc==1 ? `u` : `d`}</button>
    </div>
    <div className="grid w-full grid-cols-auto-fit-400 gap-8 p-8 text-lg">
      {books.map((book: Book) => (
        <BookCard book={book} key={book.id} />
      ))}
    </div>
  </>
  );
}

export default BookList;
