import { AxiosResponse } from "axios";
import { apiClient } from "./axios";
import { Damage } from "./dto/damage.dto";

export const getDamagesFromPost = async (postId: string) => {
  try {
    const res: AxiosResponse<Damage[]> = await apiClient.get(`/damages?postId=${postId}`);

    return res.data;
  } catch (error) {
    console.error("Failed to get damages", error);
    return Error("Failed to get damages");
  }
};