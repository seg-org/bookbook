import { BookTagType, GenreType } from "../../app/api/books/book_enum";

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  pages: number;
  publisher: string;
  coverImageUrl: string;
  coverImageKey: string;
  bookGenres?: GenreType[];
  bookTags?: BookTagType[];
  verifiedStatus: string;
  recommendPrice?: number;
};
