import { AxiosResponse } from "axios";

import { EditBookFormData } from "@/app/book/[id]/edit/page";

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

export const getBook = async (id: string) => {
  try {
    const res: AxiosResponse<Book> = await apiClient.get(`/books/${id}`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get book with id ${id}`, error);
    return Error(`Failed to get book with id ${id}`);
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
