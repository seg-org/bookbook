import { AxiosResponse } from "axios";

import { z } from "zod";
import { GetPostsRequest } from "../app/api/posts/schemas";
import { apiClient } from "./axios";
import { GetPostsResponse, Post } from "./dto/post.dto";

export type GetPostsFilters = z.infer<typeof GetPostsRequest>;
export const getAllPosts = async (params?: GetPostsFilters) => {
  try {
    const res: AxiosResponse<GetPostsResponse> = await apiClient.get("/posts", {
      params,
    });

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
