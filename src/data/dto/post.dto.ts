import { DamageType, SpecialDescriptionType } from "../../app/api/posts/post_enum";
import { Book } from "./book.dto";

export type Post = {
  id: string;
  title: string;
  content: string;
  price: number;
  published: boolean;
  sellerId: string;
  book: Book;
  bookId: string;
  specialDescriptions?: SpecialDescriptionType[];
  damageURLs: string[];
  damage: DamageType;
  createdAt: Date;
  updatedAt: Date;
  verifiedStatus: string;
};

export type GetPostsResponse = {
  posts: Post[];
  total: number;
  totalPages: number;
  page: number;
};
