import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Post } from "./dto/post.dto";

export const getAllPosts = async () => {
  try {
    const res: AxiosResponse<Post[]> = await apiClient.get("/posts");

    return res.data;
  } catch (error) {
    console.error("Failed to get all posts", error);
    return Error("Failed to get all posts");
  }
};
