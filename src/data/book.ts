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

export const getBooksBySeller = async (sellerId: string) => {
  try {
    const res: AxiosResponse<Book[]> = await apiClient.get("/books/seller/" + sellerId);

    return res.data;
  } catch (error) {
    console.error(`Failed to get books with sellerId ${sellerId}`, error);
    return Error(`Failed to get books with sellerId ${sellerId}`);
  }
};
