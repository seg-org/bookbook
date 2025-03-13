import { AxiosResponse } from "axios";

import { apiClient } from "./axios";
import { Book } from "./dto/book.dto";

export const getAllBooks = async () => {
  try {
    const res: AxiosResponse<Book[]> = await apiClient.get("/books");

    return res.data;
  } catch (error) {
    console.error("Failed to get all books", error);
    return Error("Failed to get all books");
  }
};

export type GetBookQuery = {
  title?: string;
};

export const getBooks = async (query?: GetBookQuery) => {
  const { title } = query ?? {};

  try {
    const url = title ? `/books?title=${title}` : "/books";

    const res: AxiosResponse<Book[]> = await apiClient.get(url);

    return res.data;
  } catch (error) {
    console.error("Failed to get all books", error);
    return Error("Failed to get all books");
  }
};
