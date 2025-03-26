import { useEffect, useState } from "react";

import { BookTagType, GenreType } from "@/app/api/books/book_enum";
import { SpecialDescriptionType } from "@/app/api/posts/post_enum";
import { usePostContext } from "@/context/postContext";

export default function SpecialSearch() {
  const { setPostsFilters } = usePostContext();
  const [selectedSpecialDescriptions, setSelectedSpecialDescriptions] = useState<SpecialDescriptionType[]>([]);
  const [selectedBookGenres, setSelectedBookGenres] = useState<GenreType[]>([]);
  const [selectedBookTags, setSelectedBookTags] = useState<BookTagType[]>([]);

  useEffect(() => {
    setPostsFilters((prev) => ({
      ...prev,
      specialDescriptions: selectedSpecialDescriptions.length > 0 ? selectedSpecialDescriptions : undefined,
      bookGenres: selectedBookGenres.length > 0 ? selectedBookGenres : undefined,
      bookTags: selectedBookTags.length > 0 ? selectedBookTags : undefined,
    }));
  }, [selectedSpecialDescriptions, selectedBookGenres, selectedBookTags, setPostsFilters]);

  const toggleSelection = <T,>(item: T, selectedItems: T[], setSelectedItems: (items: T[]) => void) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <>
      <p className="mb-2 font-semibold">ค้นหาหนังสือด้วยเงื่อนไขพิเศษ</p>
      <div className="flex flex-col gap-4">
        {/* Special Descriptions (from posts) */}
        <div>
          <p className="font-semibold">คุณสมบัติพิเศษของโพสต์</p>
          <div className="flex flex-wrap gap-3">
            {Object.values(SpecialDescriptionType).map((description) => (
              <label key={description} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSpecialDescriptions.includes(description)}
                  onChange={() =>
                    toggleSelection(description, selectedSpecialDescriptions, setSelectedSpecialDescriptions)
                  }
                />
                {description}
              </label>
            ))}
          </div>
        </div>

        {/* Book Genres (from books) */}
        <div>
          <p className="font-semibold">ประเภทของหนังสือ</p>
          <div className="flex flex-wrap gap-3">
            {Object.values(GenreType).map((genre) => (
              <label key={genre} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookGenres.includes(genre)}
                  onChange={() => toggleSelection(genre, selectedBookGenres, setSelectedBookGenres)}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        {/* Book Tags (from books) */}
        <div>
          <p className="font-semibold">แท็กของหนังสือ</p>
          <div className="flex flex-wrap gap-3">
            {Object.values(BookTagType).map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookTags.includes(tag)}
                  onChange={() => toggleSelection(tag, selectedBookTags, setSelectedBookTags)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}