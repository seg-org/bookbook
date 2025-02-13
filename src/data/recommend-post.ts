import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Post } from "./dto/post.dto";

export const getRecommendPosts = async (userId: string) => {
    try {
      const res: AxiosResponse<Post> = await apiClient.get("/posts/recommend", {
        params: { user_id: userId },
      });
  
      return res.data;
    } catch (error) {
      console.error("Failed to get all posts", error);
      return Error("Failed to get all posts");
    }
  };