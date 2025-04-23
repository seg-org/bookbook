"use client";

import { useEffect, useState } from "react";

import { BookTagType, GenreType } from "@/app/api/books/book_enum";
import { SpecialDescriptionType } from "@/app/api/posts/post_enum";
import { usePostContext } from "@/context/postContext";
import { bookTagInThai, genreInThai, specialDescriptionInThai } from "@/lib/translation";

export default function SpecialSearch() {
  const { setPostsFilters } = usePostContext();
  const [selectedSpecialDescriptions, setSelectedSpecialDescriptions] = useState<SpecialDescriptionType[]>([]);
  const [selectedBookGenres, setSelectedBookGenres] = useState<GenreType[]>([]);
  const [selectedBookTags, setSelectedBookTags] = useState<BookTagType[]>([]);

  // Update filters in the context whenever the selected enums change
  useEffect(() => {
    setPostsFilters((prev) => ({
      ...prev,
      specialDescriptions: selectedSpecialDescriptions.length > 0 ? selectedSpecialDescriptions : undefined,
      bookGenres: selectedBookGenres.length > 0 ? selectedBookGenres : undefined,
      bookTags: selectedBookTags.length > 0 ? selectedBookTags : undefined,
    }));
  }, [selectedSpecialDescriptions, selectedBookGenres, selectedBookTags, setPostsFilters]);

  // Toggle selection for checkboxes
  const toggleSelection = <T,>(item: T, selectedItems: T[], setSelectedItems: (items: T[]) => void) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <>
      <p className="mb-4 font-semibold">ค้นหาหนังสือด้วยเงื่อนไขพิเศษ</p>
      <div className="flex flex-col gap-5">
        {/* Book Genres (from books) */}
        <div>
          <p className="font-semibold">ประเภทของหนังสือ</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {GenreType.options.map((genre) => (
              <label key={genre} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookGenres.includes(genre)}
                  onChange={() => toggleSelection(genre, selectedBookGenres, setSelectedBookGenres)}
                />
                {genreInThai[genre]}
              </label>
            ))}
          </div>
        </div>

        {/* Book Tags (from books) */}
        <div>
          <p className="font-semibold">แท็กของหนังสือ</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {BookTagType.options.map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookTags.includes(tag)}
                  onChange={() => toggleSelection(tag, selectedBookTags, setSelectedBookTags)}
                />
                {bookTagInThai[tag]}
              </label>
            ))}
          </div>
        </div>

        {/* Special Descriptions (from posts) */}
        <div>
          <p className="font-semibold">คุณสมบัติพิเศษของหนังสือ</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {SpecialDescriptionType.options.map((description) => (
              <label key={description} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSpecialDescriptions.includes(description)}
                  onChange={() =>
                    toggleSelection(description, selectedSpecialDescriptions, setSelectedSpecialDescriptions)
                  }
                />
                {specialDescriptionInThai[description]}
              </label>
            ))}
          </div>
        </div>
      </div>
      {/* Selected */}
      <div className="mt-6 rounded-md border border-gray-300 bg-gray-50 p-4 break-words">
        <h3 className="mb-2 font-semibold">Selected:</h3>
        <p>
          <strong>Selected Book Genres:</strong>{" "}
          {selectedBookGenres.map((genre) => genreInThai[genre]).join(", ")}
        </p>
        <p>
          <strong>Selected Book Tags:</strong>{" "}
          {selectedBookTags.map((tag) => bookTagInThai[tag]).join(", ")}
        </p>
        <p>
          <strong>Selected Special Descriptions:</strong>{" "}
          {selectedSpecialDescriptions.map((description) => specialDescriptionInThai[description]).join(", ")}
        </p>
      </div>
    </>
  );
}
