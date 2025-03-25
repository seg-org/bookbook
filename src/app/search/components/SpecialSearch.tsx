import { useState, useEffect } from "react";
import { usePostContext } from "@/context/postContext";
import { SpecialDescriptionType, GenreType, BookTagType } from "@/app/api/books/book_enum";

export default function SpecialSearch() {
  const { setPostsFilters } = usePostContext();

  // State for special descriptions
  const [selectedSpecialDescriptions, setSelectedSpecialDescriptions] = useState<SpecialDescriptionType[]>([]);
  // State for book genres
  const [selectedBookGenres, setSelectedBookGenres] = useState<GenreType[]>([]);
  // State for book tags
  const [selectedBookTags, setSelectedBookTags] = useState<BookTagType[]>([]);

  // Update filters in context whenever the state changes
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
      <p className="mb-2 font-semibold">ค้นหาหนังสือด้วยเงื่อนไขพิเศษ</p>
      <div className="flex flex-col gap-4">
        {/* Special Descriptions */}
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

        {/* Book Genres */}
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

        {/* Book Tags */}
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