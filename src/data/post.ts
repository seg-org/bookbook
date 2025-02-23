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

export const getPost = async (id: string) => {
  try {
    const res: AxiosResponse<Post> = await apiClient.get(`/posts/${id}`);

    return res.data;
  } catch (error) {
    console.error(`Failed to get post with id ${id}`, error);
    return Error(`Failed to get post with id ${id}`);
  }
};

export const getRecommendedPosts = async (userId: string) => {
  try {
    const res: AxiosResponse<Post[]> = await apiClient.get("/posts/recommend", {
      params: { user_id: userId },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to get all posts", error);
    return Error("Failed to get all posts");
  }
};
