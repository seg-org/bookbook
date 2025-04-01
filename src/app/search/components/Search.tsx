"use client";

import { ChangeEventHandler, Fragment, useMemo, useState } from "react";

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

      {shouldShowSuggestedBooks && (
        <div className="absolute mt-12 w-96 rounded-lg bg-white p-4" data-testid="autocomplete-suggested-books">
          {suggestedBooks.map((bookTitle, index) => (
            <Fragment key={bookTitle}>
              <button
                key={bookTitle}
                className="w-full cursor-pointer rounded-lg p-2 text-left transition-colors hover:bg-gray-100"
                onClick={() => onSelect(bookTitle)}
              >
                {bookTitle}
              </button>
              {index !== suggestedBooks.length - 1 && <hr className="my-2" />}
            </Fragment>
          ))}

          {suggestedBooks.length === 0 && <p className="text-gray-400">ไม่พบข้อมูล</p>}
        </div>
      )}
    </>
  );
}
