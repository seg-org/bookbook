import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Post } from "./dto/post.dto";
import { PostFilterCondition } from "./dto/postFilterCondition";

export const getFilteredPosts = async (condition: PostFilterCondition) => {
  try {
    // const { title, author, publisher, isbn } = condition;
    console.log(condition);
    const res: AxiosResponse<Post[]> = await apiClient.post("/posts/filtered", {
      condition,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to get all posts", error);
    return Error("Failed to get all posts");
  }
};
