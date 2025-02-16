import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Bookmark } from "./dto/bookmark.dto";

export const createBookmark = async (postId: string) => {
  try {
    const res: AxiosResponse<Bookmark> = await apiClient.post("/bookmarks", { postId });

    return res.data;
  } catch (error) {
    console.error("Failed to get all posts", error);
    return Error("Failed to get all posts");
  }
};

export const getMyBookmarks = async () => {
  try {
    const res: AxiosResponse<Bookmark[]> = await apiClient.get(`/bookmarks`);

    return res.data;
  } catch (error) {
    console.error("Failed to get my bookmarks", error);
    return Error("Failed to get my bookmarks");
  }
};
