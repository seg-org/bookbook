import { Book } from "./book.dto";
import { SpecialDescriptionType } from "../../app/api/posts/post_enum";

export type Post = {
  id: string;
  title: string;
  content: string;
  price: number;
  published: boolean;
  bookId: string;
  book: Book;
  sellerId: string;
  specialDescriptions?: SpecialDescriptionType[];
  damageURLs?: string[];
};
