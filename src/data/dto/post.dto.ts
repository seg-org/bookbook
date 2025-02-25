import { Book } from "./book.dto";

export type Post = {
  id: string;
  title: string;
  content: string;
  price: number;
  published: boolean;
  bookId: string;
  book: Book;
  sellerId: string;
};

export type GetPostsResponse = {
  posts: Post[];
  total: number;
  totalPages: number;
  page: number;
};
