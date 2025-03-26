import { useEffect, useState } from "react";

import { BookTagType, GenreType } from "@/app/api/books/book_enum";
import { SpecialDescriptionType } from "@/app/api/posts/post_enum";
import { usePostContext } from "@/context/postContext";

const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
      <p className="mb-4 font-semibold">ค้นหาหนังสือด้วยเงื่อนไขพิเศษ</p>
      <div className="flex flex-col gap-5">
        {/* Book Genres (from books) */}
        <div>
          <p className="font-semibold">ประเภทของหนังสือ</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GenreType.options.map((genre) => (
              <label key={genre} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookGenres.includes(genre)}
                  onChange={() => toggleSelection(genre, selectedBookGenres, setSelectedBookGenres)}
                />
                {formatEnumLabel(genre)}
              </label>
            ))}
          </div>
        </div>

        {/* Book Tags (from books) */}
        <div>
          <p className="font-semibold">แท็กของหนังสือ</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BookTagType.options.map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookTags.includes(tag)}
                  onChange={() => toggleSelection(tag, selectedBookTags, setSelectedBookTags)}
                />
                {formatEnumLabel(tag)}
              </label>
            ))}
          </div>
        </div>
        {/* Special Descriptions (from posts) */}
        <div>
          <p className="font-semibold">คุณสมบัติพิเศษของหนังสือ</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SpecialDescriptionType.options.map((description) => (
              <label key={description} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSpecialDescriptions.includes(description)}
                  onChange={() =>
                    toggleSelection(description, selectedSpecialDescriptions, setSelectedSpecialDescriptions)
                  }
                />
                {formatEnumLabel(description)}
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
