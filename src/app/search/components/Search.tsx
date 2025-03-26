"use client";

import clsx from "clsx";
import { ChangeEventHandler, useMemo, useState } from "react";

import { usePostContext } from "@/context/postContext";

type SearchProps = {
  title: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSelect: (title: string) => void;
};

export default function Search({ title, onChange, onSelect }: SearchProps) {
  const { posts } = usePostContext();

  const bookList = useMemo(() => [...new Set(posts.map((post) => post.book.title))], [posts]);
  const matchedBooks = useMemo(
    () => bookList.filter((book) => book.toLowerCase().includes(title.toLowerCase())),
    [bookList, title]
  );
  const suggestedBooks = useMemo(() => matchedBooks.slice(0, 5), [matchedBooks]);

  const [focused, setFocused] = useState(false);

  const shouldShowSuggestedBooks = useMemo(
    () => title.length > 0 && focused && suggestedBooks.every((book) => book !== title),
    [title, focused, suggestedBooks]
  );

  return (
    <>
      <input
        className="flex-1 rounded-md border border-gray-300 p-1"
        data-testid="search-by-book-name"
        type="text"
        placeholder="ชื่อหนังสือ"
        value={title}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 100)}
      />

      <div
        className={clsx(
          "absolute mt-12 w-96 rounded-lg bg-white p-4 transition-opacity",
          !shouldShowSuggestedBooks && "pointer-events-none hidden opacity-0"
        )}
        data-testid="autocomplete-suggested-books"
      >
        {suggestedBooks.map((book, index) => (
          <>
            <button
              key={book}
              className="w-full cursor-pointer rounded-lg p-2 text-left transition-colors hover:bg-gray-100"
              onClick={() => onSelect(book)}
            >
              {book}
            </button>
            {index !== suggestedBooks.length - 1 && <hr className="my-2" />}
          </>
        ))}

        {suggestedBooks.length === 0 && <p className="text-gray-400">ไม่พบข้อมูล</p>}
      </div>
    </>
  );
}
