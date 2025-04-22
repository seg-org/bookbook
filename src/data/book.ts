import { AxiosResponse } from "axios";

import { BookTagType, GenreType } from "@/app/api/books/book_enum";
import { EditBookFormData } from "@/app/book/[id]/edit/page";

import { apiClient } from "./axios";
import { Book } from "./dto/book.dto";

interface CreateBook {
  title: string;
  author: string;
  description?: string;
  pages: number;
  publisher: string;
  coverImageKey: string;
  bookGenres: GenreType[];
  bookTags: BookTagType[];
}

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
  verifiedStatus?: string;
};

export const getBooks = async (query?: GetBookQuery) => {
  const { title } = query ?? {};

  try {
    const url =
      `/books` +
      (query?.verifiedStatus ? `?verifiedStatus=${query.verifiedStatus}` : "") +
      (title ? `&title=${title}` : "");

    const res: AxiosResponse<Book[]> = await apiClient.get(url);

    return res.data;
  } catch (error) {
    console.error("Failed to get all books", error);
    return Error("Failed to get all books");
  }
};

export const getBook = async (id: string) => {
  try {
    const res: AxiosResponse<Book> = await apiClient.get(`/books/${id}`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get book with id ${id}`, error);
    return Error(`Failed to get book with id ${id}`);
  }
};

export const createBook = async (dto: CreateBook) => {
  try {
    const res: AxiosResponse<Book> = await apiClient.post(`/books`, dto);

    return res.data;
  } catch (error) {
    console.error(`Failed to create book with dto ${dto}`, error);
    return Error(`Failed to create book with dto ${dto}`);
  }
};

export const editBook = async (data: EditBookFormData, id: string) => {
  try {
    const res: AxiosResponse<Book> = await apiClient.patch(`/books/${id}`, data);

    return res.data;
  } catch (error) {
    console.error(`Failed to patch book with id ${id}`, error);
    return Error(`Failed to patch book with id ${id}`);
  }
};

export const deleteBook = async (id: string) => {
  try {
    const res: AxiosResponse = await apiClient.delete(`/books/${id}`);

    return res.data;
  } catch (error) {
    console.error(`Failed to delete book with id ${id}`, error);
    return Error(`Failed to delete book with id ${id}`);
  }
};

export const getUnverifiedBooks = async () => {
  try {
    const res: AxiosResponse<Book[]> = await apiClient.get("/admin/new-book");

    return res.data;
  } catch (error) {
    console.error("Failed to get unverified books", error);
    return Error("Failed to get unverified books");
  }
};
